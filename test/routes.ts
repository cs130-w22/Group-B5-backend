//import testing framework
import 'mocha'
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
let server = require('../src/index');
let should = chai.should();

// import database management
const models = require('../src/db/models/index');
import { deleteUser, deleteRace, deleteUserHistory } from '../src/db';

// define test user
const TEST_USERNAME = "testing";
const TEST_PASSWORD = "testing";

// define test race
const TEST_TITLE = "testing";
const TEST_DATE = new Date();
const TEST_DIFFICULT = "testing";
const TEST_NUM_PARTICIPANTS = 1;
const TEST_TIME_TO_SOLVE = 1;
const TEST_WINNER = "testing";
const TEST_NEW_RACE = new models.Race({
    title: TEST_TITLE,
    date: TEST_DATE,
    difficulty: TEST_DIFFICULT,
    numParticipants: TEST_NUM_PARTICIPANTS,
    timeToSolve: TEST_TIME_TO_SOLVE,
    winner: TEST_WINNER
});

// define test user history
// id will be defined later
const TEST_WON = true;

// testing the POST and SIGNUP routes
describe('Testing Routes', () => {
    describe('Testing POST /auth/signup', () => {
        it('Should allow user to create a user', (done) => {
            chai.request('http://localhost:8080')
                .post('/auth/signup')
                .type('application/json')
                .send({
                    'username': TEST_USERNAME,
                    'password': TEST_PASSWORD,
                })
                .then((res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property("token");
                    expect(res.body.token).to.not.be.null;
                })
                .then(done, done)
        });
    });
    describe('Testing POST /auth/login', () => {
        it('Should allow user to login', (done) => {
            chai.request('http://localhost:8080')
                .post('/auth/login')
                .type('application/json')
                .send({
                    'username': TEST_USERNAME,
                    'password': TEST_PASSWORD,
                })

                // possible remove chai-json
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("token");
                    expect(res.body.token).to.not.be.null;
                })
                .then(done, done)
        });
    });

    describe('Testing Race related routes', () => {
        let race_id;
        let user_id;
        describe('Testing GET /stats/race', () => {
            before(async function () {
                // runs once after the last test in this block
                const doc = await TEST_NEW_RACE.save();
                race_id = doc._id;
            });

            it('Should allow user to get race stats', (done) => {
                chai.request('http://localhost:8080')
                    .get('/stats/race/' + race_id)
                    // possible remove chai-json
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property("date");
                        expect(res.body).to.have.property("difficulty");
                        expect(res.body).to.have.property("numParticipants");
                        expect(res.body).to.have.property("timeToSolve");
                        expect(res.body).to.have.property("winner");
                    })
                    .then(done, done)
            });
        });

        describe('Testing GET /stats/user', () => {
            before(async function () {
                // runs once after the last test in this block
                const TEST_USER_HISTORY = new models.UserHistory({
                    name: TEST_USERNAME,
                    race: race_id,
                    won: TEST_WON,
                });
                const doc = await TEST_USER_HISTORY.save();
                user_id = doc._id;
            });

            it('Should allow user to get race stats', (done) => {
                chai.request('http://localhost:8080')
                    .get('/stats/user/' + TEST_USERNAME)
                    // possible remove chai-json
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property("numWins");
                        expect(res.body).to.have.property("numRaces");
                        expect(res.body).to.have.property("races");
                    })
                    .then(done, done)
            });
        });

        after(async function () {
            // runs once after the last test in this block
            await deleteRace(race_id);
            await deleteUserHistory(user_id);
        });
    });

    after(async function () {
        // runs once after the last test in this block
        await deleteUser(TEST_USERNAME);
    });
});

