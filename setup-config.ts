import { writeFile, readFile } from "fs/promises";
import { render } from "mustache";

interface BuildSubgraphYmlProps {
  network: string | "mainnet" | "ropsten" | "rinkeby" | "kovan" | "local";
  startBlock: number;
  contracts: {
    pool: {
      address: string;
    };
    lpToken: {
      address: string;
    };
    myToken: {
      address: string;
    };
    flashLoan: {
      address: string;
    };
    borrower: {
      address: string;
    };
  };
}

async function buildSubgraphYaml(viewProps: BuildSubgraphYmlProps) {
  const subgraphYamlTemplate = await readFile("./subgraph.template.yaml", {
    encoding: "utf8",
  });
  const subgraphYamlOut = render(subgraphYamlTemplate, viewProps);
  await writeFile("./subgraph.yaml", subgraphYamlOut);
}

const setupNetwork = async () => {
  await buildSubgraphYaml({
    network: "local",
    startBlock: 9142254,
    contracts: {
      pool: {
        address: "0x67f5eaf667c8e23C95FF67E99db7B10bd51Ab4bd",
      },
      lpToken: {
        address: "0xEb920F7a990C4d33a004a19542cF6F5eAd1cf541",
      },
      myToken: {
        address: "0x621c7184F6AEb78835E94df6112121AF178F8d87",
      },
      flashLoan: {
        address: "0x01578948393249143D916728E81Eb60D0334C24E",
      },
      borrower: {
        address: "0x4Ea203Ff43d0eE98346e73826239B6eB06B83d7C",
      },
    },
  });
};

setupNetwork();
