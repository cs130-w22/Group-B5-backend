import { expect } from 'chai';
import Dotenv from 'dotenv';
import 'mocha';

import { Tracker } from '../src/socket/tracker';
import { Race } from '../src/socket/race';
import Problem from '../src/lib/problem';

const TEST_DIFFICULTY = "Easy";

let server = require('../src/index');

describe("# Tracker Tests", () => {

    let tracker = new Tracker();
    const code = tracker.createLobby(TEST_DIFFICULTY);

    it("Testing the creation of a Lobby", () => {
        const lobby = tracker.findLobby(code);
        expect(lobby).to.equal(TEST_DIFFICULTY)
    });

    it("Testing starting a race", async () => {
        const problem = await tracker.start(code);
        expect(problem).to.instanceOf(Problem);
    });

    it("Testing Finding a Race", () => {
        const race = tracker.findRace(code);
        expect(race).to.instanceOf(Race);
    });

    it("Testing Deleting a Race", () => {
        tracker.removeRace(code);
        const race = tracker.findRace(code);
        expect(race).to.be.undefined;
    });

    it("Testing the removal of a Lobby", () => {
        tracker.removeLobby(code);
        const lobby =  tracker.findLobby(code);
        expect(lobby).to.be.undefined;
    });

    it("Testing Random Matchmaking", async () => {

        // first search should not yield a new lobby 
        const search1 = await tracker.search(TEST_DIFFICULTY);
        expect(search1[1]).to.equal(false);

        // cancel the search
        tracker.cancelSearch(search1[0]);

        // second search should not yield a new lobby
        const search2 = await tracker.search(TEST_DIFFICULTY);
        expect(search2[1]).to.equal(false);

        // third search should yield a new lobby
        const search3 = await tracker.search(TEST_DIFFICULTY);
        expect(search3[1]).to.equal(true);

        const code = search3[0]
        tracker.removeRace(code);
        tracker.removeLobby(code);
    });


});