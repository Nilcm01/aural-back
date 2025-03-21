# Aural - Backend

Aquest repositori és l'entorn de treball de l'aplicació dedicat a la part de backend del sistema.

## Guia sobre el desenvolupament

Regles generals i d'estil:
- El títol de cada commit cal que digui de forma breu i directa a què afecta i com. Cal emprar l'anglès.
- La descripció de cada commit cal que desglossi els canvis fets. Podeu emprar la llengua que vulgueu.
- No feu commits amb claus, tokens o "clientId" o cap informació sensible.
- La branca main únicament contindrà versions funcionals o "releases". No s'hi poden fer commits directament.
- La branca dev únicament contindrà les versions consolidades de funcionalitats que estan sent treballades. És preferible no fer-hi commits directament.
- Per a qualsevol tasca de desenvolupament caldrà crear una branca nova sobre la qual treballar (seguiu la seqüència descrira al següent apartat).
- Noms de variables, mètodes i estructures autodescriptives.
- Emprar l'estil lowerCamelCase per a mètodes i variables i HIGHER_CASE per a constants i variables globals.
- Evitar números màgics (números solts sense context).
- Afegir context amb comentaris, del què fa si no és clar, o del perquè.

Seguiu la següent guia per a dur a terme el desenvolupament satisfactòriament entre tots:
- Per a cada funcionalitat, cal que creeu (o empreu) una nova branca per a aquesta, des d'on hi treballareu fins que estigui completada segons ha estat establert.
- Un cop estigui llesta, i abans de prosseguir, feu un pull de la branca dev per assegurar que la tingueu al dia.
- Feu una pull request d'aquesta branca amb la branca dev.
- Abans de poder-hi fer el merge caldrà que un mínim de dos companys la validin i l'aprovin.
- Quan es tingui una versió funcional de l'aplicació que es vulgui "publicar", caldrà fer una pull request de la branca dev sobre main.
- Abans de poder-hi fer el merge caldrà que, per darrer cop, mínim un company la validi i l'aprovi.

## Llicència

***Aural*** © 2025 del grup ***LIS2025-G10*** té llicència [CC BY-NC-SA 4](https://creativecommons.org/licenses/by-nc-sa/4.0).

### Sou lliure de:
- Compartir: copiar i redistribuir el material en qualsevol mitjà i format
- Adaptar: remesclar, transformar i crear a partir del material 

El llicenciador no pot revocar aquestes llibertats, sempre que seguiu els termes de la llicència.

### Amb els termes següents:
- Reconeixement: Heu de reconèixer l'autoria de manera apropiada , proporcionar un enllaç a la llicència i indicar si heu fet algun canvi . Podeu fer-ho de qualsevol manera raonable, però no d'una manera que suggereixi que el llicenciador us dóna suport o patrocina l'ús que en feu.
- NoComercial: No podeu utilitzar el material per a finalitats comercials .
- CompartirIgual: Si remescleu, transformeu o creeu a partir del material, heu de difondre les vostres creacions amb la mateixa llicència que l'obra original.

No hi ha cap restricció addicional: No podeu aplicar termes legals ni mesures tecnològiques que restringeixin legalment a altres de fer qualsevol cosa que la llicència permet.
