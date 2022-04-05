
// Made by plesalex100 for Underground Romania
// Foloseste acest cod fara probleme pentru server-ul tau !
// Si ajuta si tu la randul tau pe oricine din comunitatea de FiveM


// de unde se ia acest cod: https://i.imgur.com/fc2wxX3.png
const serverCode = "gr4lvo";


const offlineObj = document.getElementById("offlineBadge");
const onlineObj = document.getElementById("onlineBadge");
const playersObj = document.getElementById("onlinePlayers");
const serverNameObj = document.getElementById("serverName");
const directConnectObj = document.getElementById("directConnect");

directConnectObj.onclick = () => {
	window.location = `fivem://connect/${serverCode}`;
}

let hasBeenOnline = false, hasNotifiactionSent = false;

if(("Notification" in window) && Notification.permission !== "granted" && Notification.permission !== "denied") {
	Notification.requestPermission();
}

function updateServerStatus() {
	let apiLink = `https://servers-frontend.fivem.net/api/servers/single/${serverCode}`;

	fetch(apiLink).then(response => response.json()).then(data => {

		if(data.error) {
			$(onlineObj).hide();
			$(offlineObj).show();
			$(directConnectObj).hide();
			$(playersObj).text("Unknown");
			
			top.document.title = `(WARNING) Server Offline`;
			if(hasBeenOnline && !hasNotifiactionSent) {
				hasNotifiactionSent = true;
				if ("Notification" in window) {
					if (Notification.permission === "granted") {
						let notification = new Notification("Server offline !");
					}
					else if (Notification.permission !== "denied") {
						Notification.requestPermission().then(function(permission) {
							if (permission === "granted") {
								let notification = new Notification("Server offline !");
							}
						});
					}
				}
			}
		} else {
			
			hasBeenOnline = true;
			hasNotifiactionSent = false;

			let playersOn = data.Data.clients;
			let serverName = data.Data.hostname;
			let slots = data.Data.sv_maxclients;
			
			top.document.title = `(${playersOn}/${slots}) Server Status`;
			$(offlineObj).hide();
			$(onlineObj).show();
			$(directConnectObj).show();
			$(playersObj).text(`${playersOn}/${slots}`);

			// todo: use fivem colors syntax.
			// deocamdata le scoate direct pur si simplu din titlu
			serverName = serverName.replace(/\^[1-9]/g, '');

			$(serverNameObj).text(serverName);
		}

	});
}

setTimeout(() => {
	updateServerStatus();
	setInterval(updateServerStatus, 5000);
}, 500);
