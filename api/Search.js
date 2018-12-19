import { Promise as Promis } from 'bluebird';

export const barcodeListSearch = (barcode) => {
  if (barcode.length === 0) { return []; }

  return barcode.map(async (bc) => {
    const results = await busqueda(bc);
    if (results.length > 0) {
      results[0].added = true;
      return results[0];
    }
  });
};
export const busqueda = async (term) => {
  const isBarcode = term.match(/\d+/gm) ? true : false;

  const resultadosW = await buscaWoolworthsAsync(term, isBarcode);
  let resultadosC = [];
  if (isBarcode) {
    resultadosC = await buscaColesAsync(term, isBarcode);
  }
  else {
    resultadosC = await Promis.map(resultadosW, async (item) => {
      if (item.barcode !== null) {
        const a = await buscaColesAsync((item).barcode, true);
        if (a.length > 0 && a[0] !== undefined) {
          return a[0];
        }
      }
    });
  }

  const combinados = await combinaResultados([resultadosW, resultadosC]);

  return combinados;
};

const buscaWoolworthsAsync = async (term, isBarcode = false) => {
  if (isBarcode && !term.match(/\d+/gm)) {
    throw new Error(`${term} is not a barcode`);
  }

  const queryUrl = 'https://www.woolworths.com.au/apis/ui/Search/products';
  const query = {
    SearchTerm: term,
    PageSize: 12,
    PageNumber: 1,
    SortType: 'TraderRelevance',
    Location: '/shop/search/products?searchTerm=' + term,
  };

  try {
    const resultados = await fetch(queryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });

    const productsRaw = await resultados.json();
    const products = [];

    if (productsRaw.Products === null) { return products; }
    productsRaw.Products.map((productOuter) => {
      productOuter.Products.map((productInner) => {
        if (!isBarcode || productInner.Barcode === term) {
          const data = {
            barcode: productInner.Barcode || Math.floor(Math.random() * 1000).toString(),
            hasCupString: productInner.HasCupPrice,
            cupString: productInner.CupString,
            image: productInner.MediumImageFile,
            name: productInner.Name,
            price: productInner.Price,
            special: productInner.IsOnSpecial,
            savingsAmount: productInner.SavingsAmount,
            packageSize: productInner.PackageSize,
            origin: 'w',
          };

          products.push(data);
        }
      });
    });

    return products;
  }
  catch (err) {
    throw new Error('buscaWoolworthsAsync: ' + err);
  }
};
const buscaColesAsync = async (term, isBarcode = false) => {
  if (isBarcode && !term.match(/\d+/gm)) {
    throw new Error(`${term} is not a barcode`);
  }

  const payload = `<devicefingerprint>
	<Attributes>
<Attribute>
		<Name>OS</Name>
		<Value><![CDATA[Mac OSX (Version Unknown) Unknown]]></Value>
	</Attribute>
<Attribute>
		<Name>TIME_ZONE</Name>
		<Value><![CDATA[11]]></Value>
	</Attribute>
<Attribute>
		<Name>SCREEN_ATTRIBUTES</Name>
		<Value><![CDATA[24|1280|800|1280|777]]></Value>
	</Attribute>
<Attribute>
		<Name>USER_AGENT</Name>
		<Value><![CDATA[mozilla/5.0 (macintosh; intel mac os x 10_14_1) applewebkit/537.36 (khtml, like gecko) chrome/70.0.3538.110 safari/537.36|MacIntel]]></Value>
	</Attribute>
<Attribute>
		<Name>BROWSER_VER</Name>
		<Value><![CDATA[Chrome 70]]></Value>
	</Attribute>
<Attribute>
		<Name>LANGUAGES</Name>
		<Value><![CDATA[BRW=en-AU|SYS=|USR=]]></Value>
	</Attribute>
<Attribute>
		<Name>FLASH_VER</Name>
		<Value><![CDATA[Not Installed]]></Value>
	</Attribute>
<Attribute>
		<Name>SILVERLIGHT</Name>
		<Value><![CDATA[Not Installed]]></Value>
	</Attribute>
<Attribute>
		<Name>PLUGINS</Name>
		<Value><![CDATA[Plugin 0: Chrome PDF Plugin; Portable Document Format; internal-pdf-viewer; (Portable Document Format; application/x-google-chrome-pdf; pdf). Plugin 1: Chrome PDF Viewer; ; mhjfbmdgcfjbbpaeojofohoefgiehjai; (; application/pdf; pdf). Plugin 2: Native Client; ; internal-nacl-plugin; (Native Client Executable; application/x-nacl; ) (Portable Native Client Executable; application/x-pnacl; ). ]]></Value>
	</Attribute>
<Attribute>
		<Name>FONTS</Name>
		<Value><![CDATA[Arial Black|Courier New|Menlo|Papyrus|Plantagenet Cherokee|Tahoma|Trebuchet MS|Webdings]]></Value>
	</Attribute>
<Attribute>
		<Name>TIME_SKEW</Name>
		<Value><![CDATA[]]></Value>
	</Attribute>
<Attribute>
		<Name>GEOIP_HTML5</Name>
		<Value><![CDATA[undefined]]></Value>
	</Attribute>
<Attribute>
		<Name>CANVAS</Name>
		<Value><![CDATA[396d29a426c8717b7a2514f4acd640f68a902e0af96399119f32278d856b79cf]]></Value>
	</Attribute>
<Attribute>
		<Name>LOCAL_IP</Name>
		<Value><![CDATA[Local IP is not defined]]></Value>
	</Attribute>
<Attribute>
		<Name>HASH</Name>
		<Value><![CDATA[e85142af8aef046709b146add7998b830c0dd26e1e01d9e5535bf3fcbdc6f4ef]]></Value>
	</Attribute>
	</Attributes>
</devicefingerprint>`;

  const queryUrl = 'https://shop.coles.com.au/search/resources/store/20501/productview/bySearchTerm/' + term;

  try {
    let productsRaw;
    const resultados = await fetch(queryUrl, {
      method: 'GET',
      credentials: 'include',
    });

    // let's wait for the body
    const body = await resultados.text();

    // If it is an html it means we need to send a POST to awasah
    // to get a new cookie.
    const isHtml = /<html>/gmi.test(body);
    if (isHtml) {
      const awasah = await fetch('https://shop.coles.com.au/fp/awasah/', {
        headers: {
          'Content-type': 'application/xml',
        },
        method: 'POST',
        credentials: 'include',
        body: payload,
      });
      // We should have the new cookie now.
      // Send the request again.
      const resultados2 = await fetch(queryUrl, {
        method: 'GET',
        credentials: 'include',
      });
      productsRaw = await resultados2.json();
    } else {
      productsRaw = JSON.parse(body);
    }

    const products = productsRaw.catalogEntryView.map((product) => {
      const data = {
        barcode: isBarcode ? term : undefined,
        hasCupString: true,
        cupString: product.u2.toUpperCase().replace('PER', ' / '),
        image: 'https://shop.coles.com.au' + product.t,
        name: product.n,
        price: Number(product.p1.o),
        special: product.t1 && product.t1.toUpperCase() === 'S',
        savingsAmount: product.p1.l4 && (Number(product.p1.l4) - Number(product.p1.o)),
        packageSize: product.a.O3[0].toLowerCase(),
        origin: 'c',
      };

      return data;
    });

    return products;
  }
  catch (err) {
    throw new Error('Error al buscar producto: ' + err);
  }
};
const ordenaPreciosComparador = (a, b) => {
  return a.price - b.price;
};
const combinaResultados = (resultados) => {
  if (resultados.length <= 0) { return; }

  const tarjetas = [];

  let unArray = resultados.reduce((acc, item) => {
    return acc.concat(item);
  });

  while (unArray.length > 0) {
    const primerItem = unArray.shift();
    if (!primerItem) { continue; }

    const iguales = unArray.filter((item) => {
      return item && item.barcode === primerItem.barcode;
    });

    const diferentes = unArray.filter((item) => {
      return item && item.barcode !== primerItem.barcode;
    });

    unArray = diferentes;

    const tarjeta = {
      added: false,
      barcode: primerItem.barcode,
      imageUrl: primerItem.image,
      name: primerItem.name,
      size: primerItem.packageSize,
      prices: [{
        id: primerItem.origin + primerItem.barcode,
        cupString: primerItem.cupString,
        price: primerItem.price,
        store: primerItem.origin,
        special: primerItem.special,
      }],
    };

    iguales.forEach((item) => {
      if (item) {
        tarjeta.prices.push({
          id: item.origin + item.barcode,
          cupString: item.cupString,
          price: item.price,
          store: item.origin,
          special: item.special,
        });
      }
    });

    tarjeta.prices.sort(ordenaPreciosComparador);

    tarjetas.push(tarjeta);
  }
  return tarjetas;
};
