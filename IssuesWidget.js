function executeWidgetCode() {
    const container = document.getElementById("issueInfo");
    if (container) {
        container.innerHTML = "<p style='color:blue;'>JS cargado correctamente desde GitHub Pages.</p>";
    }
    console.log("JS cargado correctamente desde GitHub Pages");

    var myWidget = {
        fetchIssue: async function (issueId, securityCtx) {
            try {
                const url = `https://my3DEXPERIENCE-APIGateway/api/dsiss/v1/issue/${issueId}?$fields=title,state,name`;
                console.log("Llamando a:", url);

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "SecurityContext": securityCtx,
                        "Accept": "application/json"
                    },
                    credentials: "include"
                });

                console.log("Status de la respuesta:", response.status);

                if (!response.ok) {
                    throw new Error("Error en la llamada: " + response.status);
                }

                const issueData = await response.json();
                console.log("Respuesta completa:", issueData);

                myWidget.displayIssue(issueData);
            } catch (error) {
                console.error("Error obteniendo Issue:", error);
                container.innerHTML += "<p style='color:red;'>Error cargando Issue: " + error.message + "</p>";
            }
        },

        displayIssue: function (issue) {
            if (!container) return;

            let rawJson = "<h3>Respuesta cruda del API:</h3><pre>" + JSON.stringify(issue, null, 2) + "</pre>";

            let table = `
                <h3>Datos principales:</h3>
                <table border="1" style="border-collapse: collapse;">
                  <tr><th>Physical ID</th><td>${issue.physicalId || "-"}</td></tr>
                  <tr><th>Name</th><td>${issue.name || "-"}</td></tr>
                  <tr><th>Title</th><td>${issue.title || "-"}</td></tr>
                  <tr><th>State</th><td>${issue.state || "-"}</td></tr>
                </table>
            `;

            container.innerHTML += rawJson + table;
        },

        onLoadWidget: function () {
            const issueId = widget.getValue("issueId");
            const securityCtx = widget.getValue("securityCtx");

            console.log("Issue ID:", issueId);
            console.log("Security Context:", securityCtx);

            container.innerHTML += `
                <p>Issue ID leído: ${issueId || "(vacío)"}</p>
                <p>Security Context leído: ${securityCtx || "(vacío)"}</p>
            `;

            if (issueId) {
                myWidget.fetchIssue(issueId, securityCtx);
            } else {
                container.innerHTML += "<p style='color:orange;'>Configure un Physical ID en las preferencias.</p>";
            }
        }
    };

    // Aquí está la línea correcta:
    widget.addEvent("onLoad", myWidget.onLoadWidget);
}
