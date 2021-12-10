import { parseUnits } from "ethers/lib/utils";
import { JestBeforeEachContext } from "../helpers";
import { jestAfterAll, jestBeforeAll, jestBeforeEach } from "../jest/setup";

describe("Pool", () => {
  let context: JestBeforeEachContext;
  beforeAll(async () => {
    await jestBeforeAll();
    context = await jestBeforeEach();

    const {
      borrower,
      flashLoan,
      lpToken,
      myToken,
      pool,
      provider,
      deployerAddress,
      userAddress,
      querySubgraph,
      user,
      waitForSubgraphSync,
    } = context;

    await myToken.mint(deployerAddress, parseUnits("35"));
    await myToken.mint(userAddress, parseUnits("20"));

    await myToken.approve(pool.address, parseUnits("35"));
    await myToken.connect(user).approve(borrower.address, parseUnits("20"));

    await pool.setConfigurationPool(
      lpToken.address,
      flashLoan.address,
      myToken.address
    );

    await lpToken.grantPoolRole();

    await pool.deposit(parseUnits("30"));
    await pool.deposit(parseUnits("1"));

    await flashLoan
      .connect(user)
      .borrowTokens(borrower.address, myToken.address, parseUnits("10"));
    await flashLoan
      .connect(user)
      .borrowTokens(borrower.address, myToken.address, parseUnits("3"));
    await waitForSubgraphSync();
  });

  test("Should return new deposit", async () => {
    const { data } = await context.querySubgraph(
      `{
      deposits  {
        id
        poolAddress
        tokenAmount
        poolDepositor {
          id
        }
      }
    }`
    );

    const [deposit] = data.deposits;

    expect(context.pool.address.toLowerCase()).toMatch(
      deposit.poolAddress.toLowerCase()
    );

    expect(context.deployerAddress.toLowerCase()).toMatch(
      deposit.poolDepositor.id.toString()
    );

    expect(deposit.tokenAmount).toMatch(parseUnits("30").toString());
  });

  test("Should return new withdraw", async () => {
    await context.lpToken.approve(
      context.pool.address,
      (await context.lpToken.balanceOf(context.deployerAddress)).toString()
    );
    await context.pool.withdraw();
    await context.waitForSubgraphSync();
    const { data } = await context.querySubgraph(
      `{
      withdraws  {
        id
        poolAddress
        tokenAmount
        poolDepositor {
          id
        }
      }
    }`
    );

    const [withdraw] = data.withdraws;

    expect(context.pool.address.toLowerCase()).toMatch(
      withdraw.poolAddress.toLowerCase()
    );

    expect(context.deployerAddress.toLowerCase()).toMatch(
      withdraw.poolDepositor.id.toLowerCase()
    );

    expect(withdraw.tokenAmount).toMatch(parseUnits("31").toString());
  });

  test("Should return new PoolHistory", async () => {
    const { data } = await context.querySubgraph(
      `{
        poolHistories {
          id
          poolAddress
          reward
        }
    }`
    );

    const [poolHistories] = data.poolHistories;
    expect(data).not.toBe(null);
    expect(context.pool.address.toLowerCase()).toMatch(
      poolHistories.poolAddress.toLowerCase()
    );
  });
});
