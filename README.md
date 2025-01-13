# Eliza Starter with Protected Vector Database

This concept is an iteration of the [Eliza Starter](https://github.com/elizaOS/eliza-starter) that integrates the following:

- Uses a [fork of OrbisDB](https://github.com/mzkrasner/orbisdb) to create vectorized conversation logs
- Uses [Lit Protocol](https://www.litprotocol.com/) to provide programmatic encryption and decryption of the vector database entries

## Running the app

In this section I will walk you through how to deploy and run this app.

### Prerequisites

To run this app, you need the following:

1. An [OpenAI](https://platform.openai.com/) API key
2. A modified [OrbisDB] instance (outlined below)
3. Docker
4. A [Lit](https://www.litprotocol.com/) token ID (also shown below)

## Initial Setup

To run the app locally, follow these steps:

1. Clone this repo and install the dependencies

```sh
git clone https://github.com/ceramicstudio/eliza-with-lit-orbisdb
cd eliza-with-lit-orbisdb
pnpm install
```

2. In a separate terminal, clone this modified version of OrbisDB and install the dependencies

```sh
git clone https://github.com/mzkrasner/orbisdb
cd orbisdb
npm install
```

3. In your orbisdb terminal, start the database process

```sh
# Ensure that you have your Docker Daemon running in the background first
npm run dev
```

Your OrbisDB instance will need to initially be configured using the GUI running on `localhost:7008`. Navigate to this address in your browser and follow these steps:

a. For "Ceramic node URL" enter the following value: `https://ceramic-orbisdb-mainnet-direct.hirenodes.io/`

This is the default public Ceramic node that the hosted Orbis Studio uses. We will leverage this to avoid the setup of a local Ceramic node

b. For "Ceramic Seed" simply click "generate a new one" and go to the next page

c. For "Database configuration" enter the following:

```sh
User=postgres
Database=postgres
Password=postgres
Host=localhost
Port=5432
```

These are the default configurations your Docker image is using. Entering them here enables you to configure your OrbisDB instance to index Ceramic stream data using your dockerized Postgres instance.

Go to the next page

d. Click next on the presets page (do not select anything)

e. Connect with your Metamask account and click "Get started". Keep the Orbis Studio UI in your browser as we will navigate back to it later

4. Go to your `orbis-lit-langchain` terminal and copy the example env file

```sh
cp .env.example.local .env
```

5. Navigate to your browser running the OrbisDB UI and create a new context. You can call this anything you want. Once saved, click into your new context and copy the value prefixed with "k" into your `.env` file

```sh
CONTEXT_ID="<your-context-id>"
```

Contexts allow developers to organize their data across different applications or projects. When this application uses the Orbis SDK to write embeddings, it will leverage this context when making the write request

6. Next, we will create an OrbisDB seed to self-authenticate onto the Ceramic Network using the Orbis SDK

```sh
pnpm gen-seed
```

This is the seed the Orbis SDK will use to self-authenticate your OrbisDB client onto the Ceramic Network in order to perform writes.

Copy only the array of numbers into your `.env` file

```sh
# enter as a string like "[2, 19, 140, 10...]"
ORBIS_SEED="your-array-here"
```

Make sure the final number in your array does not contain a trailing comma

7. Copy an active and funded OpenAI API key into your `.env` file next to `OPENAI_API_KEY`

8. Choose or create a dummy Metamask address and claim Lit Protocol Testnet tokens using that address by visiting `https://chronicle-yellowstone-faucet.getlit.dev/`

9. Navigate to `https://explorer.litprotocol.com/` in your browser and sign in with the same dummy address as the previous step. Once signed in, click "Mint a new PKP". After minting, copy the value under "Token ID" into your `.env` file

```sh
LIT_TOKEN_ID="<your-token-id>"
```

10. Grab the private key from your dummy Metamask wallet (used in the two steps above) and enter it into your `.env` file

```sh
ETHEREUM_PRIVATE_KEY="<your-private-key>"
```

11. Finally, deploy your OrbisDB data model we will use to create and query via vector search

```sh
pnpm deploy-model
```

This creates a new "table" in your OrbisDB instance by creating a Ceramic model stream using the model definition found in [scripts/deploy-model.mjs](./scripts/deploy-model.mjs).

Copy the value prefixed with "k" into your `.env` file

```sh
TABLE_ID="<your-table-id>"
```

## Starting the Agent

The character used below has already been set up to use OpenAI as the provider. To start it up, run:

```bash
pnpm start --characters="characters/jack.character.json"
```

## Current Flow

As you'll notice in the [src/index.ts](/src/index.ts) file, a new `StorageService` instance is created within the `handleUserInput` method to manage the conversation between the agent and the user, which entails:

1. Vectorizing the initial user input
2. Encrypting the input's plaintext values with Lit
3. Storing the embedding + encrypted plaintext on OrbisDB

After these steps, `getEmbeddingContext` is used to search the OrbisDB vectors to get relevant logs, and decrypting them if the default access control conditions are met. This is loaded as context when prompting the agent.

Finally, after obtaining the response from the agent, the same steps are taken to vectorize, encrypt, and store the agent's response in OrbisDB

### Considerations

At the moment, the protected database flow is only integrated into conversations. However, this can be modified to query OrbisDB when responding to posts on X, making new posts, or performing other agent actions.

**Note: Static Embedding Type**

The flow with OrbisDB + Lit currently only supports embeddings using the OpenAI format. This means that you will run into errors trying to use other LLM providers.

OrbisDB embedding support for other embedding types is expected in the near future.

## Access control

At the moment, very simple access control conditions are being leveraged based on whether the wallet trying to read the data contains >=0.000001 ETH (found in the [access service](./src/services/access.service.ts)).

```typescript
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "1000000000000", // 0.000001 ETH
    },
  },
];
```

There is a wide array of access control conditions you can use or create. For more information, visit [Lit's Access Control documentation](https://developer.litprotocol.com/sdk/access-control/intro).

## Edit the character files

Open `agent/src/character.ts` to modify the default character. Uncomment and edit.

### Custom characters

To load custom characters instead:
- Use `pnpm start --characters="path/to/your/character.json"`
- Multiple character files can be loaded simultaneously

### Add clients

```diff
- clients: [],
+ clients: ["twitter", "discord"],
```

## Duplicate the .env.example template

```bash
cp .env.example .env
```

\* Fill out the .env file with your own values.

### Add login credentials and keys to .env

```diff
-DISCORD_APPLICATION_ID=
-DISCORD_API_TOKEN= # Bot token
+DISCORD_APPLICATION_ID="000000772361146438"
+DISCORD_API_TOKEN="OTk1MTU1NzcyMzYxMT000000.000000.00000000000000000000000000000000"
...
-OPENROUTER_API_KEY=
+OPENROUTER_API_KEY="sk-xx-xx-xxx"
...
-TWITTER_USERNAME= # Account username
-TWITTER_PASSWORD= # Account password
-TWITTER_EMAIL= # Account email
+TWITTER_USERNAME="username"
+TWITTER_PASSWORD="password"
+TWITTER_EMAIL="your@email.com"
```
