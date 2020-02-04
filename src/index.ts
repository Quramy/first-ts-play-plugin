import { Diagnostic } from 'typescript';
let started = false;
const customPlugin: import('./vendor/playground').PlaygroundPlugin = {
  id: 'typePuzzle',
  displayName: 'Type Puzzle',
  shouldBeSelected: () => false,
  modelChanged: (sandbox, model) => {
    if (!started) return;
    sandbox.getWorkerProcess().then(worker => {
      return Promise.all([worker.getSemanticDiagnostics(model.uri.toString()), worker.getSyntacticDiagnostics(model.uri.toString())]);
    }).then((diags: Diagnostic[][]) => {
      console.log(diags);
      if (started && !diags[0].length && !diags[1].length) {
        document.getElementById('plug_out')!.innerHTML = `
        <div style="font-size: 40px">🎉</div>
        `;
      }
    });
  },
  didMount: (sandbox, container) => {
    console.log('Showing new plugin!!!')

    const startButton = document.createElement('input')
    startButton.type = 'button'
    startButton.value = 'Start'
    container.appendChild(startButton)

    const out = document.createElement('div');
    out.id = 'plug_out';
    container.appendChild(out);

    startButton.onclick = (event) => {
      started = true;
      sandbox.setText(`// Solve the following semantic errors:

const x: string = 1;
`);
      (event.target as HTMLButtonElement).disabled = true;
    }
  },
  didUnmount: () => {
    console.log('Removing plugin')
    started = false;
  },
}

export default customPlugin
