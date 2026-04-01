function executeWidgetCode() {
    var myWidget = {
        fetchIssue: async function (issueId, securityCtx) {
            try {
                const url = `https://my3DEXPERIENCE-APIGateway/api/dsiss/v1/issue/${issueId}?$fields=title,state,name`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "SecurityContext": securityCtx,
                        "Accept": "application/json"
                    },
                    credentials: "include" // usa la sesión del usuario logeado
                });

                if (!response.ok) {
                    throw new Error("Error en la llamada: " + response.status);
                }

                const issueData = await response.json();
                myWidget.displayIssue(issueData);
            } catch (error) {
                console.error("Error obteniendo Issue:", error);
                document.getElementById("issueInfo").innerHTML = "Error cargando Issue.";
            }
        },

        displayIssue: function (issue) {
            const container = document.getElementById("issueInfo");
            if (!container) return;

            container.innerHTML = `
                <table>
                  <tr><th>Physical ID</th><td>${issue.physicalId}</td></tr>
                  <tr><th>Name</th><td>${issue.name}</td></tr>
                  <tr><th>Title</th><td>${issue.title}</td></tr>
                  <tr><th>State</th><td>${issue.state}</td></tr>
                </table>
            `;
        },

        onLoadWidget: function () {
            const issueId = widget.getValue("issueId");
            const securityCtx = widget.getValue("securityCtx");
            if (issueId) {
                myWidget.fetchIssue(issueId, securityCtx);
            } else {
                document.getElementById("issueInfo").innerHTML = "Configure un Physical ID en las preferencias.";
            }
        }
    };

    widget.addEvent("onLoad", myWidget.onLoadWidget);
}
