const chooLog = require('choo-log');
const choo = require('choo');
const html = require('choo/html');

const logger = chooLog();
const app = choo({
  onAction: logger.onAction,
  onError: logger.onError,
  onStateChange: logger.onStateChange
});

// formula: tip total = (tip amount / 100) * bill amount
app.model({
  state: { percent: '   ', amount: '   ', tip: '   ', total: '   ' },
  reducers: {
    calculateTip: (data, state) => {
      data.amount = +data.amount;
      return { percent: data.percent + '%', amount: data.amount.toFixed(2), tip: tipFormula(data).toFixed(2), total: (tipFormula(data) + data.amount).toFixed(2)  }

      function tipFormula(data) {
        return ((+data.percent / 100) * data.amount);
      }
    } 
  }
});

const view = (state, prev, send) => {
  return html`
    <main>
      <div class="tip-calculator">
        <form id="tip" autocomplete="off" onsubmit=${(e) => {
          send('calculateTip', { percent: e.target.children[1].value, amount: e.target.children[3].value });
          e.target.children[1].value = '';
          e.target.children[3].value = '';
          e.preventDefault();
        }}>
          <label for="percent">Tip percentage</label>
          <input type="text" placeholder="Input" id="percent">
          <label for="amount">Bill amount</label>
          <input type="text" placeholder="Input" id="amount">
          <button form="tip" type="submit">Calculate Tip</button>
        </form>
        <p class="inputs">Tip rate: ${state.percent} <span class="bill">Bill: $ ${state.amount}</span></p>
        <p class="results">Tip: $ ${state.tip} <span class="total">Total: $ ${state.total}</span></p>
      </div>
    </main>`
}

app.router((route) => [
  route('/', view)
]);

const tree = app.start();
document.body.appendChild(tree);
