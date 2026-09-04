# Jonyz 3D Print Lab (3dprint.jonyz.org)

Mūsdienīga, ātra un uzticama 3D drukas pasūtījumu un cenas aprēķina platforma, kas radīta izvietošanai uz **Cloudflare Pages** (bezmaksas hostings ar neierobežotu trafiku).

## 🚀 Galvenās iezīmes

1. **Interaktīvs 3D STL Skatītājs (Three.js):**
   - Velc un nomet (`Drag & Drop`) jebkuru `.stl` failu vai apskati ar vienu klikšķi testa modeli.
   - Pārlūkā tiek renderēts 3D modelis ar apgaismojumu uz virtuālās drukas pamatnes (250x250mm).
   - Atbalsta rotāciju, mērogošanu, centrēšanu un karkasa (wireframe) režīmu.
2. **Reāllaika ģeometrijas analīze:**
   - Aprēķina precīzus modeļa gabarītus ($X 	imes Y 	imes Z$ mm).
   - Aprēķina precīzu tīro tilpumu ($cm^3$) ar trijstūru tetraedru metodi.
   - Aprēķina paredzamo svaru gramos atkarībā no izvēlētā materiāla blīvuma un pildījuma (Infill).
3. **Materiālu un drukas konfigurators:**
   - Materiāli: **PETG**, **PLA**, **TPU (95A)**, **ASA / ABS**.
   - Krāsas: Melna, Pelēka, Balta, Sarkana, Oranža, Zila.
   - Pildījuma slaideris (10% - 100%).
   - Slāņa augstums (0.12mm, 0.20mm, 0.28mm).
   - Detaļu skaita reizinātājs.
4. **Cenu kalkulators:**
   - Pārskatāma cenu struktūra (Materiāls + Mašīnlaiks + Sagatavošana).
5. **Printables gatavo dizainu katalogs:**
   - Populārie modeļi (Flexi Dragon, Telefona statīvs, Austiņu turētājs, Benchy).
6. **Pasūtījumu noformēšana:**
   - Piegādes izvēle: Omniva / DPD pakomāts vai saņemšana uz vietas.
   - Visi pasūtījuma dati un konfigurācija tiek nosūtīti uz e-pastu: **autosargs@gmail.com**.

---

## 🌐 Kā izvietot uz Cloudflare Pages (3dprint.jonyz.org)

### 1. Variants: Caur GitHub (Visērtākais)
1. Izveido jaunu privātu vai publisku repozitoriju savā GitHub kontā (piem., `3dprint`).
2. Šajā mapē palaid:
   ```bash
   git add .
   git commit -m "Initial commit of 3D Print Lab"
   git remote add origin https://github.com/<tavs-lietotajs>/3dprint.git
   git push -u origin main
   ```
3. Ieej **[dash.cloudflare.com](https://dash.cloudflare.com/)** -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
4. Izvēlies `3dprint` repozitoriju:
   - Framework preset: *None*
   - Build output directory: `.` (vai atstāj tukšu).
5. Noklikšķini **Save and Deploy**.
6. Sadaļā **Custom domains** pievieno `3dprint.jonyz.org`!

---

### 2. Variants: Tiešā augšupielāde (Direct Upload)
1. Ieej **[dash.cloudflare.com](https://dash.cloudflare.com/)** -> **Workers & Pages** -> **Pages** -> **Upload assets**.
2. Ievelc šīs mapes saturu (`index.html`, `styles.css`, `app.js`).
3. Gatavs dažu sekunžu laikā!
