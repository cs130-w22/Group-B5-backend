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


});