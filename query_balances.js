const https = require('https');

const RPC_URL = 'https://seoul.worldland.foundation/';

const ADDRESSES = [
  '0x6b06b00a55fd56e7ab9f653fca90188a32627ae6',
  '0x378730f5fef3e90a8657912a0ac25af04ced5365',
  '0xc7fceaa9f2a4bda56edb431c2aa1c9759a5b4e1d',
  '0xa17e7a1f0c6a31fd86f50fca9e650a1b3c04d1a6',
  '0x9d4c48b41ba41463b373ff8d12c0f3547847df26',
  '0x3e3f4b39bdc64e76809efeecb55583dfdb47f350',
  '0x78dc5682c0854a7dae3e02ef1098c938c3f55e0d',
  '0xc21319a9c243c05694a89a02d18d89bee1d278f2',
  '0xb774b42f85e9aafcd847f9f879606235ce3acd89',
  '0x4e21be677d976268628674a1d4132a7112a227d4',
  '0x5423be425b3997be1a87e157c4dd487553488210',
  '0xce3a171e2105f82fc82763295445708acc8a2d1b',
  '0x7502657ab19faa2c03ee00582a7b8a53352f5f77',
  '0x8833e4c9a9e15654645e72c4304d90d14acf4034',
  '0x7571789890c47737514fa1d5ae1b31e312df8eda',
  '0x47384a48a34dff973ea67906520fd84b5f909a19',
  '0x8bdfb62fe9e784bdf9c9588b595941a36aa3cb6e',
  '0xf1e5a620f8bd36a1a0d6afcea30079d686001b31',
  '0x0157b786efdcd7d61ce7f6f51d24dfada7cba997',
  '0xea523cff72a3de73e9183e3d6c58717463043867',
  '0x33d46a19df2ac14d6d79a8e5d4f94aa2cef05d82',
  '0x1de1a11a61f37b9051c39d579b2c3d34dbef047f',
  '0x6932d908c4be4758186c24c69772dbe058f77de0',
  '0x8832ffbd4831c9aca31d348966a124a88a2c8dec',
  '0xbafb78a6d17b92481cce4202697122fb1aeed6b1',
  '0x67ed8c06c2c39d22703d081bb5fb14cd4b4e860f',
  '0xff027197f209a9bdc3624d619b8f728d20347529',
  '0xdfa345bc146b5dec9d958c350f218dcbdd4263d7',
  '0xaa3e67d7c629f783655856511404645ba4a11680',
  '0x73d42945fae991e6e41415e8ed1f5ae2d770b099',
  '0xd041ac3a14984725fcf0e12c9bec779113b80ced',
  '0x9837975783c169ccb40122602e03369ea7a850ce',
  '0x3496c0b390f312fd9409e125cda7871a5e636f7d',
  '0x69bdfae9855a1ea4aa3926d59cd9a748c83ef67a',
  '0x72368a8445edb39bbb85f1d0fa69b3b9c28c74d8',
  '0xcb192dc5513f36a87d4b5fb6dc26f789857aa274',
  '0xa3303667e7b062be8cf6f7f9d14361afa4a4bbc1',
  '0xafdd6af3d3d6f579af0fafe481db0f3a85259c14',
  '0xf127637eb02fa141a59e99496025cbc5dec9329b',
  '0x8f06d10cefe887288857bf1098da8f10b473fcab',
  '0xf20afa2d3e5f1bd4ae8cffc5c270e994fb5a68cc',
  '0x1df0fcb7575eb1d316de5045d83fa6bd6dc42f23',
  '0xcc3c07f770a37a67cbe112805472b2c93c24c319',
  '0x9f46cbdd16b7f297d6989fed43b528a3dec31d6a',
  '0x41962d0071f290e3a9b851424ac170eaa9a001cf',
  '0x741f9a9e1b77d5858b59e78c3f55792314f40a37',
  '0x65c89f584d78b6932bc6a5e75dd0064b1bb4420b',
  '0x68cbc3fa148b27f613fd361b229bc9c64a04f27e',
  '0x8ed724132af47949d8d875bc2195c43728221c59',
  '0x5e5590237da266d9ea84ddb776720079e461661e',
  '0xac2420e1c6b4f49fbb32c143ef45e874dfe26f69',
  '0x908499987ba12ad30a9c26d7c56b69748815bd47',
  '0xde2bce107a9ca13926e0f905399afdc42c930006',
  '0x47300c87e4a587a2f7e9672212b1d72274d376f9',
  '0xee96bb2bf4610fc9ad8cd9e16f4657f4ac9c5705',
  '0x88219250985cc7d100c56a1c540ec48c3e08ba53',
  '0x740ca43f01a912052f558fdc824674be9129722f',
  '0x981ebec48a618d77dcd73ac1c4f437e5cf485498',
  '0xcd518e4a28ced2e24e616988fcd11c48b129d2dc',
  '0xa6eea17d3cda51a0b340069c0a3f4cbfdbb809f2',
  '0x72738caeb45110a3c6a74cb9c132f28719c4d780',
  '0xb25f346c221982c7603f882891ca8d701679fa85',
  '0x76bfa75755057e594456c28a68c02e3ab24bee59',
  '0xecda58689059721cc60aef9acd967b847a25980e',
  '0x0d76ef70d1c7ef29331ec2e969329426d2bc9a72',
  '0xbe5d2149f967ba4de73f17f6e78ce7d7f94f9db6',
  '0xf60defbda2ca4f500cde930b8e2c1e919db6079f',
  '0x942b875f855860c5cb124fc5ebc4090cbd1ac6dd',
  '0x03371878c2748358468e479382b08c02b564f8cd',
  '0x74371a9ecb2df5eecc0ac75e86509dfe75e6dc23',
  '0x32b03178bf00da57d2ede0c87c0645b37169ac76',
  '0x485ffe9e639f53a8476fe0d70389ac0e4d7a2cfc',
  '0x2505b2171f86262a55002f781d324a3a96c4fbb1',
  '0x879a1ca96d0f03c404075bf29b1f8df0dc3fbcbc',
  '0x5e26042244efd67f44965fbcf6720e09f5ec5641',
  '0x17d1ce430f0e2f093b67b78ffcb43193dddae194',
  '0x0db3e5da9de349f083c75d257552f2c639e66cb4',
  '0xd63953450f10064fc0ad0ae61518e1436734aef6',
  '0x85ea746d9ea745c72a75dd0064b1bb4420b29b0d',
  '0x2e61254d9750ac34e5f555f6f0a120337cecbc64',
  '0x6ce8e017f2343982916bae8710baaaea07cf47ee',
  '0x15535355387153e2f115ced583f885cf3c1c4e6d',
  '0x79c9706cf94dafdbc135367a9da7f2adfe1f44a6',
  '0xf814e6489021153882536a6d3ccb4a947a3e1d19',
  '0xa40d4e7502c43d92b782cc192543db60130f1de8',
  '0x62b4f5af3c94f0b9f7ed54b59af7dc993125bb12',
  '0x33a642da3349333c143fc11118a1921cae760211',
  '0x87f364517e5ff042aeda5879b6a08d825a2c9bde',
  '0xf45ebfa23d84293b257f321bcdb7e8dcfce0cacc',
  '0xf65e40d157fe1af4143f7b1ed4f0f1ab7cce8622',
  '0x749482178c0b978058ddbe0d3494689c44052be4',
  '0xf08758d9398fb0f99fb1decf02666849988793a7',
  '0x772cebd025424be45ada83c0e3bff057b1217ed0',
  '0xf1642fccf86ed5b9615b3f569731c01694cf0192',
  '0x84fb77e0363b015ab858a6f4d934d4c5a67ad2a8',
  '0x869c502a6b64e115d2f467101fa83815e2988085',
  '0x3880c15065391577c5bbe4b6278be73616a7df17',
  '0x7ca53a1f797c12360df7367d3da6dac658bccf0a',
  '0xf4ff4335348516d6e4815b762935d2d542015d61',
  '0xdfa15f380e1da81b786f4d42e4299f36d73b649a',
  '0x7b049d0647ab10e3a25738aa27adf0a6495a8287',
  '0xed6eda2d084e2ec1631c539f3e7be319452f1c59',
  '0x222da86b998c70ee42ec752b264d4849b6bab0dd',
  '0xccd643792e63fdf4b4c991812cae0664b020a01a',
  '0x57fdf3a57c08970282f8b5796cad1eeaaca20cd2',
  '0x4409353c1302bee49fe35c0b4c921827734c658d',
  '0x5c11343a80f458ce07c035b321d173473f52aee0',
  '0xff889503afdfb93c671295856b93a4c11bd8bef4',
  '0x9bed56216b3e9477b62ea5ad5ec8fd3a0cdcdf3f',
  '0x91b9ac5f05dae506f340df63ef9d9c88099d002d',
  '0x064de23a1ef7379d5eedc0d5f65223f20ea5d458',
  '0x38fe949fe34a9ecbb8b4521c2d0cf5bc626c8634',
  '0xfde4c82efb9ed4b35af25b50b123f803230df06c',
  '0xe9b795cf4fa43907a8e25b716e03e20b3ac74bdc',
  '0x478128475ba59595043d47ac6df4ce3b2f608ac3',
  '0x509acf2874fc511d0bd6c3b87757f1cf1ac2078b',
  '0x97b656be8317e4b8df9f15c0c6ddab1d1160363d',
  '0x137240c0fdc06b950114f4aa27c1a005c93850ff',
  '0x270f63a616b0f851d027ce09eb02829568608beb',
  '0xa8adf8bd49991e30341ace8ccdc1e702a98bf230',
  '0xd2df6819fc6759a23240f563607099b8b60cc360',
];

function rpcCall(batch) {
  return new Promise((resolve, reject) => {
    const url = new URL(RPC_URL);
    const postData = JSON.stringify(batch);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data.substring(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function hexToWLC(hex) {
  const wei = BigInt(hex);
  const whole = wei / BigInt('1000000000000000000');
  const remainder = wei % BigInt('1000000000000000000');
  const decimal = remainder.toString().padStart(18, '0').substring(0, 4);
  return `${whole.toLocaleString()}.${decimal}`;
}

async function main() {
  console.log('='.repeat(90));
  console.log('  WorldLand (WLC) Balance Query — seoul.worldland.foundation');
  console.log('='.repeat(90));
  console.log(`  Querying ${ADDRESSES.length} addresses...\n`);

  // Batch in groups of 20
  const BATCH_SIZE = 20;
  const results = [];

  for (let i = 0; i < ADDRESSES.length; i += BATCH_SIZE) {
    const batch = ADDRESSES.slice(i, i + BATCH_SIZE).map((addr, idx) => ({
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [addr, 'latest'],
      id: i + idx,
    }));

    try {
      const responses = await rpcCall(batch);
      const sorted = Array.isArray(responses) ? responses.sort((a, b) => a.id - b.id) : [responses];
      for (const res of sorted) {
        const addrIdx = res.id;
        const addr = ADDRESSES[addrIdx];
        if (res.result) {
          const balance = hexToWLC(res.result);
          results.push({ addr, balance, weiHex: res.result, wei: BigInt(res.result) });
        } else {
          results.push({ addr, balance: 'ERROR', weiHex: '0x0', wei: BigInt(0), error: res.error?.message });
        }
      }
    } catch (err) {
      for (let j = i; j < Math.min(i + BATCH_SIZE, ADDRESSES.length); j++) {
        results.push({ addr: ADDRESSES[j], balance: 'RPC_ERROR', weiHex: '0x0', wei: BigInt(0), error: err.message });
      }
    }
  }

  // Sort results by index (original order)
  const indexMap = {};
  ADDRESSES.forEach((a, i) => (indexMap[a] = i));
  results.sort((a, b) => (indexMap[a.addr] ?? 999) - (indexMap[b.addr] ?? 999));

  // Print table
  console.log(`${'#'.padStart(4)}  ${'Address'.padEnd(44)}  ${'WLC Balance'.padStart(22)}`);
  console.log('-'.repeat(75));

  let totalWei = BigInt(0);
  let nonZero = 0;

  results.forEach((r, i) => {
    const num = String(i + 1).padStart(4);
    const balStr = r.error ? `ERROR: ${r.error}` : r.balance.padStart(22);
    console.log(`${num}  ${r.addr}  ${balStr}`);
    if (r.wei > BigInt(0)) nonZero++;
    totalWei += r.wei;
  });

  console.log('-'.repeat(75));
  console.log(`\n  Total addresses: ${results.length}`);
  console.log(`  Non-zero balances: ${nonZero}`);
  console.log(`  Total WLC: ${hexToWLC('0x' + totalWei.toString(16))}`);
  console.log('='.repeat(90));

  // Also save to CSV
  const csvLines = ['Address,WLC_Balance,Wei_Hex'];
  results.forEach((r) => {
    csvLines.push(`${r.addr},${r.balance},${r.weiHex}`);
  });
  require('fs').writeFileSync('/home/nubroo/worldland-dex/wlc_balances.csv', csvLines.join('\n'));
  console.log(`\n  CSV saved to: wlc_balances.csv`);
}

main().catch(console.error);
