/*
 * react tutorial app
 */


// https://github.com/Olical/EventEmitter
window.ee = new EventEmitter();

/*
 * Внешний список новостей
 */
var myNews = [
  {
    author: 'Саша Печкин',
    text: 'В четчерг, четвертого числа...',
    bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
  },
  {
    author: 'Просто Вася',
    text: 'Считаю, что $ должен стоить 35 рублей!',
    bigText: 'А евро 42!'
  },
  {
    author: 'Гость',
    text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
    bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
  }
];


/*
 * App component
 */
var App = React.createClass({
    getInitialState: function() {
      return {
        news: myNews
      }
    },
    componentDidMount: function(){
      var self = this;
      window.ee.addListener('News.add', function(item) {
        var nextNews = item.concat(self.state.news);
        self.setState({news: nextNews});
      });      
    },
    componentWillUnmount: function(){
      window.ee.removeListener('News.add');
    },
    render: function() {
      console.log('App.render()');
      return (
        <div className="app">
          <h3>Новости</h3>
          <Add />
          <News data={this.state.news} />            
        </div>
      );
    }
  });


/*
 * News component
 */
var News = React.createClass({
  getInitialState: function(){
    return { counter: 0 };
  },

  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  render: function(){    
  
    var propsData = this.props.data;
    var newsTemplate;
  
    if (propsData.length > 0) {
      newsTemplate = propsData.map(function(item, index){
        return (
          <div key={index}>
            <Article data={item}/>
          </div>
        )})
    } else {
      newsTemplate = <p>К сожалению новостей нет</p>;
    }
    
    return (
      <div className="news">
        {newsTemplate}
        <strong className={'news__count ' + (propsData.length>0 ? '' : 'none')}>Всего новостей: {propsData.length}</strong>       
      </div>
      );
  }
});


/*
 * Article component
 */
var Article = React.createClass({

  propTypes: {
    data: React.PropTypes.shape({
      author: React.PropTypes.string.isRequired,
      text: React.PropTypes.string.isRequired,
      bigText: React.PropTypes.string.isRequired
    })
  },

  getInitialState: function(){
    return {
      visible: false
    };
  },
  
  readmoreClick: function(event){
    event.preventDefault();
    this.setState({visible: true});
  },

  render: function(){    
 
    var author = this.props.data.author,
        text = this.props.data.text,
        bigText = this.props.data.bigText,
        visible = this.state.visible;

    return (
      <div className="article">
        <p className="news__author">{author}:</p>
        <p className="news__text">{text}</p>
          <a  href="#" 
              className={'news__readmore ' +  (visible ? 'none' : '')}
              onClick={this.readmoreClick}>
                Подбробнее
          </a>
        <p className={'news__bigText ' + (visible ? '' : 'none')}>{bigText}</p>
      </div>
    );
  }
});


/*
 * Add component
 */
var Add = React.createClass({
  getInitialState: function(){
    return {
      agreeNotChecked: true,
      authorIsEmpty: true,
      textIsEmpty: true
    }
  },
  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.author).focus();
  },
  onFieldChange: function(fieldName, e) {
    var next = {};
    if (e.target.value.trim().length > 0) {      
      next[fieldName] = false
    } else {
      next[fieldName] = true
    }
    this.setState(next);
  },
  onCheckRuleClick: function(e) {
    this.setState({ 
      agreeNotChecked: !this.state.agreeNotChecked
    });
  },
  onBtnClickHandler: function(e){
    e.preventDefault();
    var author = ReactDOM.findDOMNode(this.refs.author).value;
    var textEl = ReactDOM.findDOMNode(this.refs.text);
    var text = textEl.value

    var item = [{
      author: author,
      text: text,
      bigText: '...',
    }];

    window.ee.emit('News.add', item);

    textEl.value = '';
    this.setState({textIsEmpty: true});
  },
  render: function(){
    return (
      <form className="add cf">
        <input 
          type='text'
          className='add__author' 
          defaultValue='' 
          placeholder='Ваше имя' 
          onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
          ref='author'
        />
        <textarea          
          className='add__text' 
          defaultValue='' 
          placeholder='Текст новости' 
          ref='text'
          onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
        ></textarea>
        <label className='add_checkrule'>
          <input
            type='checkbox'
            defaultChecked={false}
            ref='checkreule'
            onClick={this.onCheckRuleClick}
          />Я согласен с правилами
        </label>
        <button
          className='add__button'
          onClick={this.onBtnClickHandler}
          ref='alert_button'
          disabled={this.state.agreeNotChecked || this.state.authorIsEmpty || this.state.textIsEmpty}>
          Добавить новость
        </button>
      </form>
      );
  }

});


ReactDOM.render(
  <App />,
  document.getElementById('root')
  );