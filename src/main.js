// Creating Timeline

function creatTimeline(timeline) {
  var i = 0;
  while (i < timeline.length) {
    var ele = document.createElement('div');
    ele.style.width = '50px';
    ele.style.height = '120px';
    ele.innerHTML = timeline[i] + "Hrs";
    var tl = document.getElementById('timeline');
    tl.appendChild(ele);
    i++;
  }
}

// Get colliding events

function collidesWith(a, b) {
  return a.end > b.start && a.start < b.end;
}

// Check for Collisions

function checkCollision(events) {
  for (var i = 0; i < events.length; i++) {
    events[i].cols = [];
    events[i].colsBefore=[];
    for (var j = 0; j < events.length; j++) {
      if (collidesWith(events[i], events[j])) {
        events[i].cols.push(j);
        if(i>j) events[i].colsBefore.push(j);
      }
    }
  }
  return events;
}

// Get Random color for event background

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Add events

function updateEvents(events) {
  events = checkCollision(events);
  var arr=events.slice(0); //clone the array
  for(var i=0; i<arr.length; i++){
  	var el=arr[i];
    el.color = getRandomColor();
    el.height = (el.end - el.start) * 2 + 'px';
    el.top = (el.start) * 2 + 'px';

    if(i>0 && el.colsBefore.length>0){
    	if(arr[i-1].column>0){
      	for(var j=0;j<arr[i-1].column;j++){
        	if(el.colsBefore.indexOf(i-(j+2))===-1){
          	el.column=arr[i-(j+2)].column;
          }
        }
        if(typeof el.column==='undefined') el.column=arr[i-1].column+1;
      }else{
      	var column=0;
        for(var j=0;j<el.colsBefore.length;j++){
          if(arr[el.colsBefore[el.colsBefore.length-1-j]].column==column) column++;
        }
      	el.column=column;
      }
    }else el.column=0;
  }

  for(var i=0; i<arr.length; i++){
 		arr[i].totalColumns=0;
  	if(arr[i].cols.length>1){ // event collision
      var conflictGroup=[];
      var conflictingColumns=[];
      addConflictsToGroup(arr[i]);
      function addConflictsToGroup(a){
        for(k=0;k<a.cols.length;k++){
          if(conflictGroup.indexOf(a.cols[k])===-1){ // Avoid adding similar events
            conflictGroup.push(a.cols[k]);
            conflictingColumns.push(arr[a.cols[k]].column);
            addConflictsToGroup(arr[a.cols[k]]); // Check event conflicts
          }
        }
      }
      arr[i].totalColumns=Math.max.apply(null, conflictingColumns); // Number of columns
    }
    arr[i].width=(600/(arr[i].totalColumns+1))+'px';
    arr[i].left=(600/(arr[i].totalColumns+1)*arr[i].column)+'px';
  }
  return arr;
}

function appendEventElements(events) {
  var i = 0;
  while (i < events.length) {
    var ele = document.createElement('div');
    ele.className = 'event';
    ele.style.height = events[i].height;
    ele.style.top = events[i].top;
    ele.style.background = events[i].color;
    ele.style.width = events[i].width;
    ele.style.left = events[i].left;
    ele.innerHTML = 'Meeting ' + events[i].id;
    var cl = document.getElementById('calendar');
    cl.appendChild(ele);
    i++;
  }
}


var timeline = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

creatTimeline(timeline);

function getEvents (events) {
  events.sort(function(a, b) {
    return a.start - b.start;
  });
  events = updateEvents(events);
  appendEventElements(events);
  return events;
};

var events = [{
  id: 123,
  start: 60,
  end: 150
}, {
  id: 124,
  start: 540,
  end: 570
}, {
  id: 125,
  start: 555,
  end: 600
}, {
  id: 126,
  start: 585,
  end: 660
}];

getEvents(events);
