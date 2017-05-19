import { h, Component } from 'preact'; // eslint-disable-line no-unused-vars

import fetchival from 'fetchival'

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      counter: 1,
      length: 1,
      interval: 0,
      text: [""],
      word: "",
      speed: 0,
      query: "",
      active: 1
    };
  }

  clearText() {
    this.setState({
      counter: 1,
      length: 1,
      text: [""],
      word: "",
    });
  }

  showWord() {
    this.setState({
      word: this.state.text[this.state.counter - 1]
    });
  }

  calculeNextConter() {
    this.setState({
      counter: this.state.counter >= this.state.length ? 1 : this.state.counter + this.state.active,
    });
  }

  showNextWord() {
    setTimeout(() => {
      this.calculeNextConter();
      this.showWord();
      this.showNextWord();
    }, this.state.interval);
  }

  componentDidMount() {
    this.setSpeed(250);
    this.setQuery("João 3:16");
    this.showNextWord();
  }

  setCounter(counter) {
    this.wait(this.state.interval * 4);
    this.setState({
      counter
    });
    this.showWord();
  }

  setSpeed(speed) {
    this.setState({
      speed: speed,
      interval: Math.ceil(60000 / parseInt(speed)),
      active: 1
    })
  }

  setQuery(query) {
    clearTimeout(this.setQueryTimeout);
    this.setQueryTimeout = setTimeout(() => {
      fetchival("http://localhost:9999/" + encodeURI(query) + "?translation=almeida").get()
        .then((json) => {
          this.setText(json.text);
        });
      this.setState({
        query: query
      })
    }, 500);
  }

  back() {
    this.wait(this.state.interval * 4);
    this.setState({
      counter: this.state.counter > 1 ? this.state.counter - 1 : 1
    });
  }

  wait(duration) {
    this.setState({
      active: 0
    });
    clearTimeout(this.waitTimeout);
    this.waitTimeout = setTimeout(() => {
      this.setState({
        active: 1
      });
    }, duration);
  }

  setText(text) {
    this.clearText();
    var arr = text.split(" ");
    this.setState({
      text: arr,
      length: arr.length
    })
  }

  render() {
    return (
      <div className='Post page'>
        <div className='card'>
          <div className='body'>Palavras por minuto: {this.state.speed}</div>
          <input
      type="range"
      className="speed-selector"
      max="600"
      min="100"
      value={this.state.speed}
      onClick={() => this.setState({
        active: 0
      })}
      onInput={e => this.setSpeed(e.target.value)}
      onChange={e => this.setSpeed(e.target.value)} />
        </div>
        <div className='card'>
          <input id="query-input" className="text-centred" onKeyup={e => this.setQuery(e.target.value)}/>
          <button onClick={() => this.setState({
        counter: 1
      })}>Recomeçar</button>
      <button onClick={() => this.back()}>Voltar</button>
      </div>
        <div className='card'>
          <h1 className="text-centred">{this.state.query}</h1>
          <div className='text text-centred'>{this.state.word}</div>
          <input
      type="range"
      className="speed-selector"
      max={this.state.length}
      min="1"
      value={this.state.counter}
      onInput={e => this.setCounter(e.target.value)}
      onChange={e => this.setCounter(e.target.value)} />
        </div>

      </div>
      );
  }
}
