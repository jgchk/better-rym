import checkAddReleasePage from './add-release'
import checkReleasePage from './release'

main()

function main () {
  if (checkAddReleasePage()) return
  if (checkReleasePage()) return
}
