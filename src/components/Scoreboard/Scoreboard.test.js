import React from "react";
import Scoreboard from "./Scoreboard";
import { shallow } from 'enzyme';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });


const mockEpisodeResults = [
  {
    "id": "episode1",
    "deaths": [
      {
        "id": "astark",
        "points": "10"
      },
      {
        "id": "tlannister",
        "points": "10"
      }
    ]
  },
  {
    "id": "episode2",
    "deaths": [
      {
        "id": "jsnow",
        "points": "10"
      },
      {
        "id": "egreyjoy",
        "points": "3"
      }
    ]
  }
];

const mockCharacters = [
  {
    id: "jsnow",
    name: "Jon Snow",
    pointsPerEpisode: {
      "0": "1",
      "1": "10",
      "2": "10",
      "3": "10",
      "4": "5",
      "5": "5",
      "6": "4"
    }
  },
  {
    id: "astark",
    name: "Arya Stark",
    pointsPerEpisode: {
      "0": "1",
      "1": "10",
      "2": "10",
      "3": "10",
      "4": "10",
      "5": "10",
      "6": "9"
    }
  }
];

const mockPlayerDeathChoicesString = `{"astark":"7","babysam":"0","bdondarrion":"3","bronn":"7","bstark":"7","btarth":"7","clannister":"7","dedd":"7","dnaharis":"7","drogon":"0","dseaworth":"0","dtargaryen":"0","egreyjoy":"7","etully":"0","gclegane":"7","gendry":"0","ghost":"0","gilly":"0","greyworm":"7","jlannister":"7","jmormont":"7","jsnow":"7","lyanna":"0","melisandre":"7","missandei":"0","nightking":"3","ppayne":"0","qyburn":"7","rarryn":"0","rhaegal":"0","sclegane":"0","sstark":"0","starly":"0","tgiantsbane":"3","tgreyjoy":"4","tlannister":"0","varys":"7","ygreyjoy":"7"}`;
const mockPlayerDeathChoices = JSON.parse(mockPlayerDeathChoicesString);

const mockActualDeathsThisEpisodeOneString = `[{"id":"astark","points":"10"},{"id":"tlannister","points":"10"}]`;
const mockActualDeathsThisEpisodeOne = JSON.parse(mockActualDeathsThisEpisodeOneString);

const mockActualDeathsThisEpisodeTwoString = `[{"id":"jsnow","points":"10"},{"id":"egreyjoy","points":"3"}]`;
const mockActualDeathsThisEpisodeTwo = JSON.parse(mockActualDeathsThisEpisodeTwoString);

const mockActualDeathsThisEpisodeThreeString = `[]`;
const mockActualDeathsThisEpisodeThree = JSON.parse(mockActualDeathsThisEpisodeThreeString);

const mockDeathChoicesByEpisodeString = `[{"character":"astark","episode":"1"},{"character":"ppayne","episode":"2"}]`;
const mockDeathChoicesByEpisode = JSON.parse(mockDeathChoicesByEpisodeString);

describe("Scoreboard", () => {
  const wrapper = shallow(<Scoreboard />)
  const instance = wrapper.instance();
  it("points should add up to zero", () => {
    const results = instance.sumPoints(0, 0);
    expect(results).toBe(0);
  });
  it("points should add up to 2", () => {
    const results = instance.sumPoints(0, 2);
    expect(results).toBe(2);
  });
  it("should be zero deaths in episode 1 (happened, nobody died)", () => {
    const results = instance.getActualDeathsThisEpisode("1", [{
      id: "episode1",
      deaths: []
    }]);
    const deaths = results.length;
    expect(deaths).toBe(0);
  });
  it("should be zero deaths in episode 3 (not happened yet)", () => {
    const results = instance.getActualDeathsThisEpisode("3", mockEpisodeResults);
    const deaths = results.length;
    expect(deaths).toBe(0);
  });
  it("should be two deaths in episode 1", () => {
    const results = instance.getActualDeathsThisEpisode("1", mockEpisodeResults);
    const deaths = results.length;
    expect(deaths).toBe(2);
  });

  it("should be zero death choices episode 6", () => {
    const results = instance.getDeathChoicesByEpisode(mockPlayerDeathChoices, "6");
    const choices = results.length;
    expect(choices).toBe(0);
  });
  it("should be three death choices episode three", () => {
    const results = instance.getDeathChoicesByEpisode(mockPlayerDeathChoices, "3");
    const choices = results.length;
    expect(choices).toBe(3);
  });
  it("should be one correct death in episode one", () => {
    const results = instance.getCorrectDeathsByEpisode(mockActualDeathsThisEpisodeOne, mockDeathChoicesByEpisode);
    const correct = results.length;
    expect(correct).toBe(1);
  });
  it("should be zero correct deaths in episode two", () => {
    const results = instance.getCorrectDeathsByEpisode(mockActualDeathsThisEpisodeTwo, mockDeathChoicesByEpisode);
    const correct = results.length;
    expect(correct).toBe(0);
  });
  it("should add up to 20 exact episode death points", () => {
    const results = instance.getEpisodeExactDeathPoints([{ character: "jsnow" }, { character: "astark" }], mockCharacters, "1");
    expect(results).toBe(20);
  });
  it("should be zero correct died sometime - episode three", () => {
    const results = instance.getCorrectDiedSometime(mockActualDeathsThisEpisodeThree, mockPlayerDeathChoices);
    const correct = results.length;
    expect(correct).toBe(0);
  });
  it("should be one correct died sometime - episode one", () => {
    const results = instance.getCorrectDiedSometime(mockActualDeathsThisEpisodeOne, mockPlayerDeathChoices);
    const correct = results.length;
    expect(correct).toBe(1);
  });
  it("should be two correct died sometime - episode two", () => {
    const results = instance.getCorrectDiedSometime(mockActualDeathsThisEpisodeTwo, mockPlayerDeathChoices);
    const correct = results.length;
    expect(correct).toBe(2);
  });
  it("should add up to 4 died sometime points", () => {
    const results = instance.getCorrectDiedSometimePoints([{ egreyjoy: "7" }, { tlannister: "7" }]);
    expect(results).toBe(4);
  });
  it("should be zero correct deaths in a different episode", () => {
    const results = instance.getDiedInDifferentEpisode(mockActualDeathsThisEpisodeOne, [{ egreyjoy: "3" }]);
    const correct = results.length;
    expect(correct).toBe(0);
  });
  it("should be one correct death in a different episode", () => {
    const results = instance.getDiedInDifferentEpisode(mockActualDeathsThisEpisodeOne, { astark: "3" });
    const correct = results.length;
    expect(correct).toBe(1);
  });
  it("should be two correct deaths in a different episode", () => {
    const results = instance.getDiedInDifferentEpisode(mockActualDeathsThisEpisodeOne, [{ astark: "3" }, { tlannister: "6" }]);
    const correct = results.length;
    expect(correct).toBe(0);
  });
  it("should add up to 2 died in different episode points", () => {
    const results = instance.getDiedInDifferentEpisodePoints([{ egreyjoy: "3" }, { tlannister: "3" }]);
    expect(results).toBe(2);
  });
});

