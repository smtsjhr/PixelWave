var record_animation = false;
var name = "image_"
var total_frames = 300;
var frame = 0;
var loop = 0;
var total_time = 2*Math.PI;
var rate = total_time/total_frames;

var t = 0;
//var rate = 0.04;

var amplitude = 0;
var frequency = 0.2;

var get_mouse_pos = false;
var get_touch_pos = false;

var stop_animation = false;
var fps, fpsInterval, startTime, now, then, elapsed;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


startAnimating(50);


function draw() {
  
  canvas.style.width = window.innerWidth + 'px'  ;
  canvas.style.height = window.innerHeight + 'px';
  var W = canvas.width;
  var H = canvas.height;
  
  ctx.fillStyle = 'rgba(0, 0, 0, .05)';
  ctx.fillRect(0, 0, W, H);
  

  let s = t;
  
  hue_shift = 100;
  luminosity_shift = 10;
  alpha = (0.5 + 0.3*Math.sin(.75*s + Math.PI))%1; 
  alpha_shift = 0.3;
  //amplitude = 150;
  amplitude_shift = 20;
  //frequency = .3;
  frequency_shift = 0*0.2*Math.sin(.2*s);
  
  for (let i = 0; i <=2 ; i++) { 
    wave(ctx, 15 , 3, [300 - i*hue_shift, 100, 70 - i*luminosity_shift], alpha + i*alpha_shift, H/2, W, amplitude - i*amplitude_shift, frequency + frequency_shift, s);    
  }
  
  //t += 1;
  
  canvas.addEventListener('mousedown', e => {
    get_mouse_pos = true;
    getMousePosition(canvas, e)
    //alpha = 0.3;
  });

  canvas.addEventListener('mouseup', e => {
    get_mouse_pos = false;
    //alpha = 0.05
  });

  canvas.addEventListener('mousemove', function(e) {
    if(get_mouse_pos) {
      getMousePosition(canvas, e)
    }
  })

  canvas.addEventListener('touchstart', function(e) {
    getTouchPosition(canvas,e);
    event.preventDefault();
    //alpha = 0.3;
  }, false);

  canvas.addEventListener('touchend', function(e) {
    //alpha = 0.05;
  }, false);

  canvas.addEventListener('touchmove', function(e) {
    getTouchPosition(canvas,e);
    event.preventDefault();
  }, false);
  
  //window.requestAnimationFrame(draw);
}



function wave(ctx, pixel_size, border, color, alpha, baseline, length, amplitude, frequency, t) {
  
  num = length/pixel_size;
  
  for (let i = 0; i < num; i++) {
    for (let j = -2; j <= 2; j++) {
    
      let a = alpha*(0.5 +0.5*Math.cos(Math.PI/2*j ));
    
      x_pos = (pixel_size+border)*i;
      y_pos = baseline + (pixel_size+border)*j + amplitude*Math.sin(frequency*(i)+t);
      pixel(ctx, pixel_size, border, color, a, x_pos, y_pos);
    
    }
  }
    
}

function pixel(ctx, pixel_size, border, hsl_color, alpha, x_pos, y_pos) {
  
  ctx.save();
  ctx.beginPath();
  ctx.rect(x_pos, y_pos, pixel_size, pixel_size);
  ctx.fillStyle = `hsla( ${hsl_color[0]}, ${hsl_color[1]}%, ${hsl_color[2]}%, ${alpha})`;
  ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
  ctx.lineWidth = border;
  ctx.stroke();
  ctx.fill();  
  ctx.restore();
   
}

function getMousePosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left)/(rect.right - rect.left);
    const y = -event.clientY + (rect.bottom - rect.top)/2 ;
  
    amplitude = 0.6*y; 
    frequency = 0.01 + 0.7*x;
    
}

function getTouchPosition(canvas, event) {
    var touch = event.touches[0];
    const rect = canvas.getBoundingClientRect()
    const x = (touch.clientX - rect.left)/(rect.right - rect.left);
    const y = -touch.clientY + (rect.bottom - rect.top)/2;
  
    amplitude = 0.6*y;
    frequency = 0.01 + 0.7*x;
       
}

function startAnimating(fps) {
    
  fpsInterval = 1000/fps;
  then = window.performance.now();
  startTime = then;
  
  animate();
}

function animate(newtime) {

  if (stop_animation) {
      return;
  }

  requestAnimationFrame(animate);

  now = newtime;
  elapsed = now - then;

  if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval);
  
      draw();
      frame = (frame+1)%total_frames;
      time = rate*frame;
      t = time;

      amplitude = 0 + 150*Math.sin(t)**2;
      frequency = 0.2 + .2*Math.sin(t)**2;

      if(record_animation) {

          if (loop === 1) { 
          let frame_number = frame.toString().padStart(total_frames.toString().length, '0');
          let filename = name+frame_number+'.png'
              
          dataURL = canvas.toDataURL();
          var element = document.createElement('a');
          element.setAttribute('href', dataURL);
          element.setAttribute('download', filename);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          }

          if (frame + 1 === total_frames) {
              loop += 1;
          }

          if (loop === 2) { stop_animation = true }
      }
  }
}