
export const APP_NAME = "BitRPC GenAI";
export const BITCOIN_ORANGE = "#f7931a";

export const BITCOIN_RPC_DOCS = `
script code python-bitcoinrpc
AuthServiceProxy is an improved version of python-jsonrpc.
It includes the following generic improvements:
HTTP connections persist for the life of the AuthServiceProxy object
sends protocol 'version', per JSON-RPC 1.1
sends proper, incrementing 'id'
uses standard Python json lib
can optionally log all RPC calls and results
JSON-2.0 batch support
It also includes the following bitcoin-specific details:
sends Basic HTTP authentication headers
parses all JSON numbers that look like floats as Decimal, and serializes Decimal values to JSON-RPC connections.
Installation
change the first line of setup.py to point to the directory of your installation of python 2.*
run setup.py
Note: This will only install bitcoinrpc. If you also want to install jsonrpc to preserve backwards compatibility, you have to replace 'bitcoinrpc' with 'jsonrpc' in setup.py and run it again.
Or simply install the library using pip:
pip install python-bitcoinrpc
Example
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
rpc_user and rpc_password are set in the bitcoin.conf file
rpc_connection = AuthServiceProxy("http://%s:%s@127.0.0.1:8332"%(rpc_user, rpc_password))
best_block_hash = rpc_connection.getbestblockhash()
print(rpc_connection.getblock(best_block_hash))
batch support : print timestamps of blocks 0 to 99 in 2 RPC round-trips:
commands = [ [ "getblockhash", height] for height in range(100) ]
block_hashes = rpc_connection.batch_(commands)
blocks = rpc_connection.batch_([ [ "getblock", h ] for h in block_hashes ])
block_times = [ block["time"] for block in blocks ]
print(block_times)
Logging all RPC calls to stderr
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
import logging
logging.basicConfig()
logging.getLogger("BitcoinRPC").setLevel(logging.DEBUG)
rpc_connection = AuthServiceProxy("http://%s:%s@127.0.0.1:8332"%(rpc_user, rpc_password))
print(rpc_connection.getinfo())
Produces output on stderr like
DEBUG:BitcoinRPC:-1-> getinfo [] DEBUG:BitcoinRPC:<-1- {"connections": 8, ...etc }
Socket timeouts under heavy load
Pass the timeout argument to prevent "socket timed out" exceptions:
rpc_connection = AuthServiceProxy(
"http://%s:%s@%s:%s"%(rpc_user, rpc_password, rpc_host, rpc_port),
timeout=120)
`;

export const COMMON_RPC_METHODS = [
  { name: 'getblockchaininfo', description: 'Returns an object containing various state info regarding blockchain processing.', category: 'Blockchain' },
  { name: 'getbestblockhash', description: 'Returns the hash of the best (tip) block in the longest block chain.', category: 'Blockchain' },
  { name: 'getblock', description: 'Returns details of a block with given blockhash.', category: 'Blockchain' },
  { name: 'getrawtransaction', description: 'Returns the raw transaction data.', category: 'Raw Transactions' },
  { name: 'getmempoolinfo', description: 'Returns details on the active state of the TX memory pool.', category: 'Blockchain' },
  { name: 'getwalletinfo', description: 'Returns an object containing various wallet state info.', category: 'Wallet' },
  { name: 'getnewaddress', description: 'Returns a new Bitcoin address for receiving payments.', category: 'Wallet' },
  { name: 'sendtoaddress', description: 'Send an amount to a given address.', category: 'Wallet' },
  { name: 'addnewaddress', description: 'Returns a new Bitcoin address for receiving payments.', category: 'Wallet' },
];
