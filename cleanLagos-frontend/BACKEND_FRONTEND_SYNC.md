# Backend-Frontend Synchronization

## ✅ Completed Adjustments

### 1. API Service Layer
**File:** `packages/shared/redux-store/src/services/api.js`
- Created axios instance with base URL configuration
- Added authentication interceptors
- Implemented all backend endpoints:
  - **Auth API:** register, verifyPhone, login, getMe
  - **Reports API:** create, getAll, assign, updateStatus
- Proper FormData handling for file uploads

### 2. Auth Slice
**File:** `packages/shared/redux-store/src/slices/authSlice.js`
- Matches backend User model exactly
- Implements phone-based authentication flow:
  1. Register → Get verification code
  2. Verify phone → Get JWT token
  3. Login → Authenticate with phone/password
- Token management with localStorage
- Role-based authentication (citizen, psp, recycler, lawma_admin, system_admin)

### 3. Reports Slice
**File:** `packages/shared/redux-store/src/slices/reportSlice.js`
- Matches backend WasteReport model
- Implements all report operations:
  - Create report with images
  - Fetch reports with pagination and filters
  - Assign reports to PSP workers (admin only)
  - Update report status with proof images
- Proper state management for reports list and pagination

### 4. Store Configuration
**File:** `packages/shared/redux-store/src/store.js`
- Redux Toolkit configuration
- Redux Persist for auth state
- Proper middleware setup

### 5. Environment Configuration
**Files:** `.env` and `.env.example`
- API URL: `http://localhost:5001/api`
- WebSocket URL: `http://localhost:5001`

## 🗑️ Removed Unnecessary Files
- ❌ `mockServer.js` - No longer needed (using real backend)
- ❌ `store-simple.js` - Replaced with proper store
- ❌ `pspSlice.js` - Consolidated into reports slice
- ❌ `recyclerSlice.js` - Consolidated into reports slice

## 📊 Backend Data Models Matched

### User Model
```javascript
{
  phone: String (required, unique),
  email: String,
  fullName: String (required),
  password: String (required),
  role: 'citizen' | 'psp' | 'recycler' | 'lawma_admin' | 'system_admin',
  address:`
ost:5001
``calh://lotpRL=htPP_WS_UT_A01/api
REACcalhost:50/lohttp:/_API_URL=EACT_APP
```
Rontend apps:r frles in youariabironment vset enve sure to api`

Makhost:5001/caltp://loto: `htld connect ontend shou5001`
Frlocalhost:p://: `httonng runniis ackend tion

Bigura Conf 🔧
##pdates
eal-time uket** for rWebSocplement ads
5. **Im image uplotion** withrt Creast Repo*Teckend
4. *al ba* with re Flow*onnticatist Authe3. **Tes
point API endse new uard** toshbomin DaUpdate Ad**ices
2.  sluxuse new Redto  Screens** e Mobile App1. **Updatxt Steps

# 🚀 Ne
#
SP worker) (Patussts` - Update tatu/sid/:i/reports `PUT /apn only)
-worker (admi PSP  tossignsign` - Arts/:id/asT /api/repoPOSters)
- `ts (with fil all repor- Getorts` /repT /api- `GE
y) onlizent (cit reporates` - CreortOST /api/repports
- `P Re

###(protected)urrent user e` - Get cuth/m`GET /api/aword
-  phone/pass- Login withogin` i/auth/lST /ap`PO
- e with OTPy phon- Verife` hon-pverifyh/api/autT /r
- `POS usenew Register  -h/register`autapi/OST /on
- `Pticati# Authen
##vailable
ints Apo## 🔌 API End}
```

r,
rd: NumbeointsRewaring],
  pProof: [St completionate,
 adline: D de,
 lled'anceleted' | 'ccomp' | '_progressted' | 'inaccep' | ' 'pending
  status:d (User),ObjectIgnedBy: ),
  assi(Userd  ObjectIssignedTo:ort),
  aepasteR (WbjectId OasteReport:
  w
{javascript``` Model
# Task``

##
`,
}er NumbintsAwarded:,
  poser)(UId edBy: Objecterifir),
  vectId (Usey: ObjcompletedBser),
  bjectId (UnedTo: O,
  assig [String]
  images:'rejected',ied' | | 'verifmpleted' s' | 'co'in_progresigned' | ' | 'assending status: 'pal',
 ic 'crit | 'high' |edium''m | erity: 'low'er',
  sevble' | 'othclaal' | 'recyedic' | 'mtion'construc | al''industri' |  'householdry:g,
  catego: Strinress},
  add Number] [Number,tes: inacoordt', intype: 'Polocation: { ,
  Stringiption: d),
  descrreg (requile: Strin
  tit(User), ObjectId ter: reporript
{
 `javascdel
``teReport Mo# Was```

##ean,
}
: BoolveActiean,
  isolied: BoPhoneVerif  is Number,
s:},
  pointr] er, Numbe: [Numbdinates, coor: 'Point' { type  location:ng,
 Stri