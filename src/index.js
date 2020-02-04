import checkAddReleasePage from './add-release'
import checkReleasePage from './release'

(function main () {
  if (checkAddReleasePage()) return
  checkReleasePage()
})()
