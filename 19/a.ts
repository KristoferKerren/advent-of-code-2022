import { findGCD, findLCD, getInput, isEqual, memoize } from '../helpers';

namespace adventOfCode19 {
  class MyRobotsAndMoney {
    constructor(
      public oreRobots: number = 1,
      public clayRobots: number = 0,
      public obsidianRobots: number = 0,
      public geodeRobots: number = 0,
      public money: Money = new Money()
    ) {}

    isBetterOrEquals(comp: MyRobotsAndMoney): boolean {
      return (
        this.oreRobots >= comp.oreRobots &&
        this.clayRobots >= comp.clayRobots &&
        this.obsidianRobots >= comp.obsidianRobots &&
        this.geodeRobots >= comp.geodeRobots &&
        this.money.greaterThanOrEqual(comp.money)
      );
    }

    hasMoreRobots(comp: MyRobotsAndMoney): boolean {
      return (
        this.oreRobots > comp.oreRobots &&
        this.clayRobots > comp.clayRobots &&
        this.obsidianRobots >= comp.obsidianRobots &&
        this.geodeRobots >= comp.geodeRobots
      );
    }

    isBetter(comp: MyRobotsAndMoney): boolean {
      return this.isBetterOrEquals(comp) && !this.isEquals(comp);
    }

    isEquals(comp: MyRobotsAndMoney): boolean {
      return !(
        this.oreRobots !== comp.oreRobots ||
        this.clayRobots !== comp.clayRobots ||
        this.obsidianRobots !== comp.obsidianRobots ||
        this.geodeRobots !== comp.geodeRobots ||
        !this.money.equals(comp.money)
      );
    }
  }

  class Money {
    constructor(
      public ore: number = 0,
      public clay: number = 0,
      public obsidian: number = 0,
      public geode: number = 0
    ) {}

    greaterThanOrEqual(compare: Money): boolean {
      return (
        this.ore >= compare.ore &&
        this.clay >= compare.clay &&
        this.obsidian >= compare.obsidian &&
        this.geode >= compare.geode
      );
    }

    greaterThan(compare: Money): boolean {
      return (
        this.greaterThanOrEqual(compare) &&
        (this.ore > compare.ore ||
          this.clay > compare.clay ||
          this.obsidian > compare.obsidian ||
          this.geode > compare.geode)
      );
    }

    equals(compare: Money): boolean {
      return (
        this.ore === compare.ore &&
        this.clay === compare.clay &&
        this.obsidian === compare.obsidian &&
        this.geode === compare.geode
      );
    }

    subtractBy(money: Money): Money {
      return new Money(
        this.ore - money.ore,
        this.clay - money.clay,
        this.obsidian - money.obsidian,
        this.geode - money.geode
      );
    }
  }

  class Blueprint {
    constructor(
      public id: number,
      public oreRobotCost: Money,
      public clayRobotCost: Money,
      public obsidianRobotCost: Money,
      public geodeRobotCost: Money
    ) {}
  }

  function getBlueprints(): Blueprint[] {
    return getInput(fileName).map((row) => {
      const [
        id,
        oreRobotCostOre,
        clayRobotCostOre,
        obsidianRobotCostOre,
        obsidianRobotCostClay,
        geodeRobotCostOre,
        geodeRobotCostObsidian,
      ] = row
        .replace('Blueprint ', '')
        .replace(': Each ore robot costs ', ';')
        .replace(' ore. Each clay robot costs ', ';')
        .replace(' ore. Each obsidian robot costs ', ';')
        .replace(' clay. Each geode robot costs ', ';')
        .replace(' obsidian.', '')
        .replaceAll(' ore and ', ';')
        .split(';')
        .map((c) => parseInt(c));
      return new Blueprint(
        id,
        new Money(oreRobotCostOre),
        new Money(clayRobotCostOre),
        new Money(obsidianRobotCostOre, obsidianRobotCostClay),
        new Money(geodeRobotCostOre, 0, geodeRobotCostObsidian)
      );
    });
  }

  function getMaxGeodes(blueprint: Blueprint, maxTime: number): number {
    let moneyAlternatives: MyRobotsAndMoney[] = [new MyRobotsAndMoney()];
    let maxGeode = 0;
    for (let time = 1; time <= maxTime; time++) {
      const nbrOfMoneyAlternatives = moneyAlternatives.length;
      const oreToOreTime = blueprint.oreRobotCost.ore + 1;
      const timeLeft = maxTime - time;
      const maxOreNeeded = Math.max(
        blueprint.oreRobotCost.ore,
        blueprint.clayRobotCost.ore,
        blueprint.obsidianRobotCost.ore,
        blueprint.geodeRobotCost.ore
      );
      const maxClayNeeded = Math.max(blueprint.obsidianRobotCost.clay);
      const maxObsidianNeeded = Math.max(blueprint.geodeRobotCost.obsidian);
      const mightBeWorthByingOreRobot = timeLeft >= oreToOreTime;
      const mightBeWorthByingClayRobot = timeLeft > 2;
      const mightBeWorthByingObsidianRobot = timeLeft > 1;
      const mightBeWorthByingGeodeRobot = timeLeft > 0;

      for (let i = 0; i < nbrOfMoneyAlternatives; i++) {
        const ma = moneyAlternatives.at(i)!;
        const canAffordOreRobot = ma.money.greaterThanOrEqual(
          blueprint.oreRobotCost
        );
        const canAffordClayRobot = ma.money.greaterThanOrEqual(
          blueprint.clayRobotCost
        );
        const canAffordObsidianRobot = ma.money.greaterThanOrEqual(
          blueprint.obsidianRobotCost
        );
        const canAffordGeodeRobot = ma.money.greaterThanOrEqual(
          blueprint.geodeRobotCost
        );
        if (
          mightBeWorthByingOreRobot &&
          canAffordOreRobot &&
          ma.oreRobots < maxOreNeeded
        ) {
          moneyAlternatives.push(
            new MyRobotsAndMoney(
              ma.oreRobots + 1,
              ma.clayRobots,
              ma.obsidianRobots,
              ma.geodeRobots,
              ma.money
                .subtractBy(blueprint.oreRobotCost)
                .subtractBy(new Money(1))
            )
          );
        }
        if (
          mightBeWorthByingClayRobot &&
          canAffordClayRobot &&
          ma.clayRobots < maxClayNeeded
        ) {
          moneyAlternatives.push(
            new MyRobotsAndMoney(
              ma.oreRobots,
              ma.clayRobots + 1,
              ma.obsidianRobots,
              ma.geodeRobots,
              ma.money
                .subtractBy(blueprint.clayRobotCost)
                .subtractBy(new Money(0, 1))
            )
          );
        }
        if (
          mightBeWorthByingObsidianRobot &&
          canAffordObsidianRobot &&
          ma.obsidianRobots < maxObsidianNeeded
        ) {
          moneyAlternatives.push(
            new MyRobotsAndMoney(
              ma.oreRobots,
              ma.clayRobots,
              ma.obsidianRobots + 1,
              ma.geodeRobots,
              ma.money
                .subtractBy(blueprint.obsidianRobotCost)
                .subtractBy(new Money(0, 0, 1))
            )
          );
        }
        if (mightBeWorthByingGeodeRobot && canAffordGeodeRobot) {
          moneyAlternatives.push(
            new MyRobotsAndMoney(
              ma.oreRobots,
              ma.clayRobots,
              ma.obsidianRobots,
              ma.geodeRobots + 1,
              ma.money
                .subtractBy(blueprint.geodeRobotCost)
                .subtractBy(new Money(0, 0, 0, 1))
            )
          );
        }
      }
      moneyAlternatives.forEach((moneyAlternative) => {
        moneyAlternative.money.ore += moneyAlternative.oreRobots;
        moneyAlternative.money.clay += moneyAlternative.clayRobots;
        moneyAlternative.money.obsidian += moneyAlternative.obsidianRobots;
        moneyAlternative.money.geode += moneyAlternative.geodeRobots;
        maxGeode = Math.max(maxGeode, moneyAlternative.money.geode);
      });

      // Filter out:
      let newArr: MyRobotsAndMoney[] = [];
      moneyAlternatives.forEach((m) => {
        const someOneHasMoreRobots = moneyAlternatives.some((mm) => {
          mm.hasMoreRobots(m);
        });
        if (someOneHasMoreRobots) return;

        const someOneIsDefBetter = moneyAlternatives.some((mm) =>
          mm.isBetter(m)
        );
        if (someOneIsDefBetter) return;

        const alreadyIn = newArr.some((mm) => mm.isEquals(m));
        if (!alreadyIn) {
          newArr.push(m);
        }
      });

      moneyAlternatives = newArr;
    }

    console.log(`blueprint ${blueprint.id}: maxGeodes is ${maxGeode}`);
    return maxGeode;
  }

  const isTestInput = false;
  const fileName = isTestInput ? './19/input-example.txt' : './19/input.txt';
  const blueprints = getBlueprints();

  const res19a = blueprints.reduce((tally, blueprint) => {
    return tally + blueprint.id * getMaxGeodes(blueprint, 24);
  }, 0);

  console.log(`Result res19a: ${res19a}`);

  const res19b = [...blueprints.slice(0, 3)].reduce((prod, blueprint) => {
    return prod * getMaxGeodes(blueprint, 32);
  }, 1);

  console.log(`Result res19b: ${res19b}`);
}
