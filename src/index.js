import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/** the Square component doesn't maintain state of its own
 * and is informed of changes by its parent component
 * hence called a controlled component. Board has full control over them
 */
function Square(props) {
    // notice how onClick does not have any ()
      return (
        <button className="square" 
            onClick={props.onClick}>
          {props.value}
        </button>
      );
      }

  class Board extends React.Component {
    renderSquare(i) {
      return <Square value={this.props.squares[i]}  
      onClick={()=> this.props.onClick(i)}/>;
    }
    
    renderRow(startIndex, sizeOfRow) {
        var rowElements = [];
        for (let i=startIndex; i < startIndex+sizeOfRow; i++){
            rowElements.push(this.renderSquare(i));
        }
        return <div className="board-row">{rowElements}</div>;
    }

    render() {
        let maxColumnsAndRows = Math.sqrt(this.props.squares.length); 
        var rowArray = [];
        for(let i=0; i < this.props.squares.length; i=i+maxColumnsAndRows) {
            rowArray.push(this.renderRow(i, maxColumnsAndRows));
        }
      return (
        <div>{rowArray}</div>
      );
    }
  }
  
  class Game extends React.Component {
      constructor(props){
          super(props);
          this.state ={
              history: [{
                  squares: Array(9).fill(null)
              }],
              xIsNext: true,
              stepNumber: 0,
              moveLocation: Array(9).fill(null),
          };
      }

      renderTurn(){
        return (this.state.xIsNext ? 'X' : 'O');
      }

      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const moveLocation = this.state.moveLocation.slice(0,this.state.stepNumber +1);
        // create a copy of the state squares
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.renderTurn();
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            moveLocation: moveLocation.concat([i]),
          });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    getMoveLocation(move){
        let moveLocation = this.state.moveLocation.slice();
        let i = moveLocation[move];
        let row = parseInt(i / 3);
        let col = i % 3;
        return '('+row+', '+col+')';
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 
                'Go to move #' + move + ' ' + this.getMoveLocation(move) :
                'Go to game start';
            console.log();
            let styleClass = (move === this.state.stepNumber) ? 'list-item-bold' : 'list-item-normal';

            return (
            <li key={move} className={styleClass}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
            );
        });

        let status;
        if(winner){
            status = 'Winner: ' + winner;
        } else{
            status = 'Next player: ' + this.renderTurn();
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares} 
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }