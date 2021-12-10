import { upAll as upDockerCompose } from "docker-compose";
import { providers } from "ethers";
import {
  Pool__factory,
  Borrower__factory,
  LpToken__factory,
  MyToken__factory,
  FlashLoan__factory,
} from "./rainbow-abis/src/typechain";
import {
  buildSubgraphYaml,
  BuildSubgraphYmlProps,
  execAsync,
  getSigners,
  waitForGraphSync,
  waitForSubgraphUp,
} from "./helpers";

(async () => {
  //5a.Zrob transakcje PO zdeployowaniu subgrapha zeby zobaczyc czy ten zjeb dziala

  console.info("1. Uruchom dockera jesli nie jest uruchomiony");
  try {
    await upDockerCompose();
  } catch (e) {
    process.exit(1);
  }

  console.info("2. Healthcheck subgrapha (waitForSubgraphUp)");
  await waitForSubgraphUp();

  console.info("3. Deploy contractow");
  const provider = new providers.JsonRpcProvider("http://localhost:8545");

  const [deployer] = getSigners(provider);

  const pool = await new Pool__factory(deployer).deploy();

  const flashLoan = await new FlashLoan__factory(deployer).deploy(
    100,
    pool.address
  );
  const myToken = await new MyToken__factory(deployer).deploy(
    "RWT",
    "Rainbow Token"
  );
  const lpToken = await new LpToken__factory(deployer).deploy(
    "LPT",
    "LpToken",
    pool.address,
    myToken.address
  );

  // const borrower = await new Borrower__factory(deployer).deploy();

  // contracts setup
  await pool.setConfigurationPool(
    lpToken.address,
    flashLoan.address,
    myToken.address
  );
  await lpToken.grantPoolRole();

  console.info("4. Zbuduj manifest");
  const buildSubgraphYamlConfig: BuildSubgraphYmlProps = {
    network: "local",
    startBlock: pool.deployTransaction.blockNumber || 1,
    contracts: {
      pool: {
        address: pool.address,
      },
      lpToken: {
        address: lpToken.address,
      },
      myToken: {
        address: myToken.address,
      },
      flashLoan: {
        address: flashLoan.address,
      },
    },
  };

  await buildSubgraphYaml(buildSubgraphYamlConfig);

  console.info("5. Zbuduj i odpal subgrapha");
  await execAsync("yarn codegen");
  await execAsync("yarn build");
  await execAsync("yarn create-local");
  await execAsync("yarn deploy-local");

  await waitForGraphSync({
    provider,
    subgraphName: "rainbow/subgraph",
  });

  console.info("6. Ciesz sie wynikami");
})();
