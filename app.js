/*
*  Author: Miguel Ángel Figueroa García (mafg.es)
*
*/

var SOURCE="./data-example.json"

function formatDate(date){
  if(!date){
    return null;
  }
  return (new Date(date)).getFullYear(); //.toLocaleDateString()
}

var HistoryItem = React.createClass({
    render: function() {
      var rawMarkup = marked(this.props.children.toString(), {sanitize: true});

      style = {};
      style.float=(this.props.data.align == 'right'?'right':'left');
      var extra_class='';
      if(this.props.data.align=='wide'){
        extra_class +='historyItemWide';
      }
      var term = this.props.data.term;
      var categories= (this.props.data.categories?this.props.data.categories.map(function(item){
        switch(item){
          case 'experience':
            return <i className="historyItemCategory fa fa-briefcase"></i>
          case 'training':
            return <i className="historyItemCategory fa fa-graduation-cap"></i>
          case 'project':
            return <i className="historyItemCategory fa fa-code"></i>
          break;
        }
      }):null)
      var start = formatDate(term.start);
      var end = formatDate(term.end);
      if(start == end){
        start= null;
      }
      return (
        <div className={'historyItem '+ extra_class} style={style}>
          <div className="historyItemDates">{start?start+' - ':''}{end?end:'Present'}</div>
          <h2 className="historyItemTitle">
            {categories}{this.props.data.title}{this.props.data.company?', ':''}<span className='secondary'>{this.props.data.company}</span>
          </h2>
          <div dangerouslySetInnerHTML={{__html: this.props.children.toString()}} />
        </div>
      );
    }
});

var HistoryTimeSeparator = React.createClass({
    render: function() {
      var date=new Date(this.props.date);
      var text = date.getFullYear();
      return (
        <div className="clearBothSeparator">
        <div className="historyTimeSeparator">
            {text}
        </div>
        </div>
      );
    }
});

var HistoryList = React.createClass({
    render: function() {
        var date = new Date();
        var start = new Date();

        var historyNodes = [];
        for(var i=0; i<this.props.data.length;i++){
          var item = this.props.data[i];
          var end = new Date(item.term.end);
          start = (item.term.start<start?item.term.start:start);
          if (item.term.end && date.getFullYear()!=end.getFullYear()){
            historyNodes.push(<HistoryTimeSeparator date={item.term.end} />);
            date=end;
          }
          historyNodes.push(
              <HistoryItem data={item}>
                {item.text}
              </HistoryItem>
            );
        }
        historyNodes.push(<HistoryTimeSeparator date={start} />);

        return (
            <div className="historyList">
              {historyNodes}
              <div className="clearBoth" />
            </div>

        );
    }
});

var ContactInfoData = React.createClass({
  render: function() {
    console.log(this.props);
    var contactMethods = this.props.data.map(function(item){
      var icon_class='fa fa-check-circle'
      switch(item.type){
        case 'phonenumber':
          icon_class = 'fa fa-mobile';
          break;
        case 'location':
          icon_class = 'fa fa-map-marker';
          break;
        case 'email':
          icon_class = 'fa fa-at';
          break;
        case 'language':
          icon_class = 'fa fa-language';
          break;
        case 'driving':
          icon_class = 'fa fa-road';
          break;
        case 'web':
          icon_class = 'fa fa-globe';
          break;
      }
      return <span><span className="contactInfoDataIcon"><i className={icon_class}></i></span>{item.value}</span>
    });

    return (
      <p className="contactInfoData">

        {contactMethods}
        <div className="clearBoth" />
      </p>
    );
  }
});

var ContactInfo = React.createClass({
  render: function() {
    return (
      <div className="contactInfo">
        <div className="contactInfoPresentation">
        <img src={this.props.personal.image} />
        <span dangerouslySetInnerHTML={{__html: this.props.personal.presentation}} />
        </div>
        <ContactInfoData data={this.props.contact} />
        <div className="clearBoth" />
      </div>
    );
  }
});


var Timeline = React.createClass({

  componentDidMount: function() {
    $.ajax({
      url: this.props.source,
      dataType: 'json',
      cache: false,
      success: function(result) {
        var data = result;
        if (this.isMounted()) {
          this.setState({
            data: data.timeline,
            person: data.person
          });
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
        console.error(this.props.source, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    if(!this.state){
      return <div className="timeline"></div>
    }
    return (
      <div className="timeline">
        <div className="timelineHeader">
        <h1>{this.state.person.name}</h1>
        <h2>{this.state.person.profession}</h2>
        <ContactInfo contact={this.state.person.contact} personal={this.state.person.personal} />
        </div>
          <div className="historyTimeSeparator">
            PRESENT
          </div>
        <HistoryList data={this.state.data}/>
        <div className="documentEnd" />
      </div>
    );
  }
});

React.render(
  <Timeline source={SOURCE}/>,
  document.getElementById('content')
);
