Diagramme

Alice et Bob s'entendent sur un "Range" raisonnable de nombres dans lequel leur secrets seront communiqués.

Alice et Bob se connectent en TCP

Alice communique les ports UDP à Bob qui lui sont disponible à la connexion. Alice doit faire confiance à Bob de n'écouter que sur un seul port.

Alice choisit le "sceau" représentant le plus son secret, puis avertis Bob.

Bob choisit le "sceau" représentant le plus son secret, puis avertis Alice.

Alice envoie une donnée dans chaque port UDP correspondant aux "sceaux" ayant autant ou moins grande valeur, puis avertis Bob.

Bob communique le résultat à Alice.