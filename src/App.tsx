import './App.css';
import BarChart from './BarChart';
import { For, createSignal, createEffect } from 'solid-js';

const data = [{
  name: 'A',
  value: 100
}, {
  name: 'B',
  value: 50
}, {
  name: 'C',
  value: -25
}, {
  name: 'D',
  value: 75
}];

function App() {
  // `createSignal` is similar to React's `useState` hook.
  const [exponent, setExponent] = createSignal(1);

  // Define functions to compute the most
  // up-to-date value for derived state variables.
  // These are called "derived signals" because they are basically
  // signals derived from the reactivity of other signals.
  // For example, this depends on the `exponent` state variable.
  const barData = () => {
    return data.map((d) => {
      return {
        name: d.name,
        // Note that in Solid state variables
        // are actually functions and must be called:
        value: d.value ** exponent(),
      }
    });
  }

  // Use `createEffect` for side effects.
  const [total, setTotal] = createSignal(0);
  createEffect(() => {
    // This will automatically re-run when `exponent` updates
    let sum = barData().reduce((acc, d) => acc + d.value, 0);
    setTotal(sum);
  });
  // In this case you can accomplish the same thing with
  // a derived signal:
  const totalAlternative = () => {
    return barData().reduce((acc, d) => acc + d.value, 0)
  }


  return <div>
    <BarChart width={600} height={320} data={barData()} />

    <input type="number" value={exponent()}
      onChange={(ev) => setExponent(parseInt(ev.currentTarget.value))} />
    <div>Current exponent is {exponent()}x.</div>
    <div>The total is {total()}.</div>
    <div>The alternative total is {totalAlternative()}.</div>

    <For each={barData()}>
      {(item) => {
        return <div>{item.name}: {item.value}</div>
      }}
    </For>
  </div>
}

export default App;