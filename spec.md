as a react software engineer developer following SOLID YAGNI KISS DRY  semantic-web principles
implement a troubleshooting support data feature as following:
in the app header, under the app title @/src/ui/Header.tsx , add a button with a download icon, it should respect rgaa rules for accessibility
next to this button add an i18n label en:"support file" / fr:"fichier d'assistance"
when button is clicked, it should trigger a download of a text file

the downloaded file should be named support.txt
it should contain :
 - current URL location
 - the app version : "Pearl : v X.Y.Z" see package.json value 
 - the queen-app version , which will be provided by queen lib method getQueenVersion "import { getQueenVersion } from 'dramaQueen/DramaIndex'; "
 - the navigator version : navigator.userAgent from navigator API
 - last successfull synchronisation date :  see following spec for this data

last successfull synchronisation date
see @/src/utils/synchronize/check.ts 
when checking synchronization result : persist the local date in  localStorage if the synch result has no error
the localStorage key should be : LAST_SYNCH_SUCCESS_DATE
local date should be human readable
