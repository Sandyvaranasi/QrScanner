function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {

    // If QR code is found
    function onScanSuccess(decodeText, decodeResult) {
        const deviceId = decodeText.split(',')[0];  // Extract deviceId from the QR code
        fetchDataFromApex(deviceId);  // Call the Apex function to get data
    }

    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",  // ID of the HTML element where the scanner will render
        { fps: 10, qrbox: 250 }
    );
    htmlscanner.render(onScanSuccess);
});

// Fetch data from Apex class using deviceId and display it
function fetchDataFromApex(deviceId) {
    const endpoint = `https://smartlogisticsinc--fullcopy.sandbox.my.salesforce-sites.com/services/apexrest/qrScanner/?deviceId=${deviceId}`;

    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + '00DVA000003s8lF!AQEAQOyGVjWrP6emPNF_9gyACYfBgw5hAjm5YlKK3a2bi5JrOqTgOc9lnEaBa6Fux_UXoTwHPRMhNAgtiFVmZe8mwxsBEumZ'  // Replace with your actual access token
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayData(data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function displayData(data) {
    const dataContainer = document.getElementById("my-qr-reader");

    if (data.length > 0) {
        dataContainer.innerHTML = `
            <h3>Device Information</h3>
            <p><strong>Device ID:</strong> ${data[0].Name}</p>
            <p><strong>Action Needed:</strong> ${data[0].Action_Needed__c}</p>
            <p><strong>Battery Voltage:</strong> ${data[0].Battery_Voltage__c}</p>
            <p><strong>Estimated Battery:</strong> ${data[0].est_Batterycalculate__c}</p>
            <p><strong>Last Connected:</strong> ${data[0].Last_Connected__c}</p>
        `;
    } else {
        dataContainer.innerHTML = "<p>No data found for the given device.</p>";
    }
}
