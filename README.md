# WorldLand DEX — Uniswap V2 Fork

WorldLand 체인(Chain ID: 103)에 Uniswap V2를 배포하기 위한 통합 레포지토리입니다.

## 📁 프로젝트 구조

```
worldland-dex/
├── v2-core/            # Uniswap/v2-core 포크 (Factory, Pair)
├── v2-periphery/       # Uniswap/v2-periphery 포크 (Router02)
├── interface/          # Uniswap/interface v2.6.5 포크 (프론트엔드)
├── deploy/             # Hardhat 배포 프로젝트
│   ├── contracts/
│   │   ├── WETH9.sol           # Wrapped WL (네이티브 토큰 래핑)
│   │   ├── v2-core/            # v2-core 컨트랙트 복사본
│   │   └── v2-periphery/       # v2-periphery 컨트랙트 복사본
│   ├── scripts/
│   │   └── deploy-all.js       # 원클릭 배포 스크립트
│   ├── hardhat.config.js
│   └── deployment.json         # 배포 결과 (배포 후 생성)
└── README.md
```

---

## 🚀 배포 3단계

### Step 1: 스마트 컨트랙트 배포

```bash
cd deploy

# 1. .env 파일 생성
cp .env.example .env
# .env에 DEPLOYER_PRIVATE_KEY 입력 (0x 접두사 없이)

# 2. 의존성 설치
npm install

# 3. 컴파일
npx hardhat compile

# 4. WorldLand 메인넷에 배포
npx hardhat run scripts/deploy-all.js --network worldland
```

배포가 완료되면 아래 정보가 출력됩니다:

- **WETH (WWL) 주소**
- **Factory 주소**
- **Router02 주소**
- **INIT_CODE_HASH** ← 프론트엔드에 반드시 패치해야 함!

결과는 `deploy/deployment.json`에도 저장됩니다.

### Step 2: 프론트엔드 설정 (interface)

배포 후 받은 주소들을 프론트엔드에 적용합니다.

#### 2-1. 환경 변수 수정

```bash
# interface/.env
REACT_APP_CHAIN_ID="103"
REACT_APP_NETWORK_URL="https://seoul.worldland.foundation/"
```

#### 2-2. Router 주소 수정

`interface/src/constants/index.ts` 6번째 줄:

```typescript
export const ROUTER_ADDRESS = "배포된_ROUTER02_주소";
```

#### 2-3. Connector 수정 (MetaMask만 사용)

`interface/src/connectors/index.ts` 30번째 줄:

```typescript
export const injected = new InjectedConnector({
  supportedChainIds: [103], // WorldLand Chain ID
});
```

#### 2-4. Multicall 주소 수정

`interface/src/constants/multicall/index.ts`:
배포한 Multicall 컨트랙트 주소를 추가하거나, 기존 이더리움 주소를 제거합니다.

#### 2-5. ⚠️ 가장 중요! INIT_CODE_HASH 패치

`@uniswap/sdk` 패키지 내 또는 로컬에서 `INIT_CODE_HASH`를 교체해야 합니다.

```bash
# node_modules 안의 SDK 파일 찾기
find interface/node_modules/@uniswap/sdk -name "*.js" | xargs grep "96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f"
```

이 해시값을 배포 시 출력된 `INIT_CODE_HASH`로 교체합니다.

또한 `FACTORY_ADDRESS`도 찾아서 교체:

```bash
find interface/node_modules/@uniswap/sdk -name "*.js" | xargs grep "5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
```

#### 2-6. WETH 주소 패치

SDK의 WETH 정의에서 chain ID 103에 대한 WWL 주소를 추가합니다.

### Step 3: 빌드 & 호스팅

```bash
cd interface
yarn install
yarn start        # 개발 서버
yarn build        # 프로덕션 빌드 (정적 파일)
```

빌드 결과물(`build/`)을 Vercel, AWS S3, 또는 인스턴스에 정적 호스팅합니다.

---

## 🔧 체인 정보

| 항목          | 값                                    |
| ------------- | ------------------------------------- |
| Chain ID      | `103`                                 |
| Ticker        | `WL`                                  |
| RPC URL       | `https://seoul.worldland.foundation/` |
| Wrapped Token | `WWL (Wrapped WL)`                    |

---

## 📝 주의사항

1. **INIT_CODE_HASH**: Factory에서 Pair를 CREATE2로 생성할 때 사용하는 해시입니다. 이더리움 메인넷 값과 다르므로 반드시 교체해야 합니다.
2. **Gas 설정**: WorldLand 체인의 gas price가 다를 수 있으므로 `hardhat.config.js`의 `gasPrice`를 조정하세요.
3. **Multicall**: 프론트엔드가 Multicall 컨트랙트를 사용합니다. 별도로 배포하거나, Multicall 없이 동작하도록 코드를 수정해야 할 수 있습니다.
