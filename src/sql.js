async function fetchDataFromEndpoint(endpoint) {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.value;
}

async function exportToXLSX() {
    const dataTeile = await fetchDataFromEndpoint('/data-api/rest/Teile');
    const dataDefekt = await fetchDataFromEndpoint('/data-api/rest/Defekt');

    const wsTeile = XLSX.utils.json_to_sheet(dataTeile);
    const wsDefekt = XLSX.utils.json_to_sheet(dataDefekt);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsTeile, 'Fertigteile');
    XLSX.utils.book_append_sheet(wb, wsDefekt, 'Defektteile');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const datum = new Date().toISOString().slice(0, 10); // Aktuelles Datum erzeugen
    const filename = `POM-Modellfabrik_${datum}.xlsx`; // Dateiname mit aktuellem Datum

    if (navigator.msSaveBlob) { // Für IE
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

async function listFertig() {
    const response = await fetch('/data-api/rest/Teile');
    const data = await response.json();
    let zeit = new Date();
    let jahr = zeit.getFullYear();
    let monat = zeit.getMonth() + 1;
    let tag = zeit.getDate();
    let datum = tag + "." + monat + "." + jahr;
    var filteredData = data.value.filter(item => item.Datum === datum);
    console.log(filteredData);
    return filteredData;
}

async function tblFertig() {
    const data = await listFertig();
    const table = document.getElementById('fertigTbl');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    data.forEach(item => {
        const row = table.insertRow();
        Object.values(item).forEach(val => {
            const cell = row.insertCell();
            cell.classList.add("fuenfBorder");
            const text = document.createTextNode(val);
            cell.appendChild(text);
        });
    });
}

async function listDefekt() {
    const response = await fetch('/data-api/rest/Defekt');
    const data = await response.json();
    let zeit = new Date();
    let jahr = zeit.getFullYear();
    let monat = zeit.getMonth() + 1;
    let tag = zeit.getDate();
    let datum = tag + "." + monat + "." + jahr;
    var filteredData = data.value.filter(item => item.Datum === datum);
    return filteredData;
}

async function tblDefekt() {
    const data = await listDefekt();
    const table = document.getElementById('defektTbl');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    data.forEach(item => {
        const row = table.insertRow();
        Object.values(item).forEach(val => {
            const cell = row.insertCell();
            cell.classList.add("sechsBorder");
            const text = document.createTextNode(val);
            cell.appendChild(text);
        });
    });
}

async function sqlQuerySchichtUpdate(schicht) {
    var id=1;
    var data = {
        Fertig: istAnz,
        Defekt: ausschuss,
        SollGes: sollAnz,
        sollGesV1: sollAnzV1,
        sollGesV2: sollAnzV2,
        sollGesV3: sollAnzV3,
        SollZeit: sollAnzProZeit,
        SollZeitV1: sollAnzV1ProZeit,
        SollZeitV2: sollAnzV2ProZeit,
        SollZeitV3: sollAnzV3ProZeit,
        IntervalV1: ivlV1,
        IntervalV2: ivlV2,
        IntervalV3: ivlV3,
        TeileProMin: min,
        Unfallfrei: unfallfrei,
        Krankheitsfälle: krankheit,
        MitarbeiterProSchicht: personal,
        FertigV1: istAnzV1,
        FertigV2: istAnzV2,
        FertigV3: istAnzV3,
        DDLZ: durchZeitMW,
        Schichtzeit: schichtzeit,
        ZeitEnde: zeitEnde,
        ZeitEndeV2: zeitEndeV2,
        ZeitEndeV3: zeitEndeV3,
        IstV2Plus: istV2Plus,
        IstV2Minus: istV2Minus,
        IstV3Plus: istV3Plus,
        IstV3Minus: istV3Minus,
        Schicht: schicht
    };
    const endpoint = '/data-api/rest/Schicht/ID';
    const response = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const result = await response.json();
}