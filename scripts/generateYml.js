
import fs from 'fs';

const personal_token = '${{ secrets.DEPLOY_KEY }}'
const scripts = {}
const dirs = fs.readdirSync('./split-words');
for (let index = 0; index < dirs.length; index++) {
  const dir = dirs[index];
  const name = dir.split('.')[0];
  const template =
  `
  name: ${name}
  on:
    watch:
      types: started

  jobs:
    deploy:
      runs-on: ubuntu-latest
      if: github.event.repository.owner.id == github.event.sender.id
      steps:
        - uses: actions/checkout@v2
        - run: npm install
        - run: npm run ${name}
        - name: Deploy
          uses: peaceiris/actions-gh-pages@v3
          with:
            personal_token: ${personal_token}
            publish_branch: main
            destination_dir: domains
            publish_dir: ./domains
            keep_files: true`
  scripts[name] = `node ./scripts/index.js ${name}`
  fs.writeFileSync(`./.github/workflows/${name}.yml`, template, { flag: 'a' });
}


fs.readFile("package.json", (err, data) => {
  if (err) throw err;
  let packageJSON = JSON.parse(data);
  packageJSON.scripts = scripts;
  fs.writeFileSync("package.json",  JSON.stringify(packageJSON, null, 2));
});
