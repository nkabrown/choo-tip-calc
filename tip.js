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
  state: { tip: '   ', total: '  ' },
  reducers: {
    calculateTip: (data, state) => {
      data.percent = +data.percent;
      data.amount = +data.amount;
      const tipTotal = Math.ceil((data.percent / 100) * data.amount);
      const totalAmount = data.amount + tipTotal;
      return { tip: tipTotal, total: totalAmount  }
    } 
  }
});

const view = (state, prev, send) => {
  return html`
    <div>
      <form id="tip" onsubmit=${(e) => {
        send('calculateTip', { percent: e.target.children[0].value, amount: e.target.children[1].value });
        e.preventDefault();
      }}>
        <input type="text" placeholder="Tip percentage" id="percent">
        <input type="text" placeholder="Bill amount" id="amount"> 
        <button form="tip" type="submit">Calculate Tip</button>
      </form>
      <p class="results">Tip: ${state.tip} Total: ${state.total}</p>
    </div>`
}

app.router((route) => [
  route('/', view)
]);

const tree = app.start();
document.body.appendChild(tree);
