// geometry transformation
function PointTransformation(point, origin, rotation, translation){

    //quaternion rotations
    qx = rotation[0];
    qy = rotation[1];
    qz = rotation[2];
    qw = rotation[3];

    //rotation matrix from quaternion
    rxx = 1 - 2*qy*qy - 2*qz*qz;
    rxy = 2*qx*qy - 2*qw*qz;
    rxz = 2*qx*qz + 2*qw*qy;
    ryx = 2*qx*qy + 2*qw*qz;
    ryy = 1 - 2*qx*qx - 2*qz*qz;
    ryz = 2*qy*qz - 2*qw*qx;
    rzx = 2*qx*qz - 2*qw*qy;
    rzy = 2*qy*qz + 2*qw*qx;
    rzz = 1 - 2*qx*qx - 2*qy*qy;

    //perform the rotation
    //b: before; a: after
    var xb = point[0] - origin[0];
    var yb = point[1] - origin[1];
    var zb = point[2] - origin[2];

    var xa = rxx*xb + rxy*yb + rxz*zb;
    var ya = ryx*xb + ryy*yb + ryz*zb;
    var za = rzx*xb + rzy*yb + rzz*zb;
    
    //translation
    xa += origin[0] + translation[0];
    ya += origin[1] + translation[1];
    za += origin[2] + translation[2];

    return [xa, ya, za];
}

// output string
var fileText = '';

// function to append text to the output string
function addText(text){
    fileText += text + "\n";
    // console.log(text); // for debugging purposes
}

var indexOffset = 1;
var objNames = ['GingivaMorphLower Jaw0', 'GingivaMorphUpper Jaw0'];

// gingiva
objNames.forEach(function(objName){
    if(scene.sceneObjectsByName[objName]){
        var objHeader, objBody;
        
        objHeader = scene.sceneObjectsByName[objName].obj.originBuffer.init_ctm.header;
        objBody = scene.sceneObjectsByName[objName].obj.originBuffer.init_ctm.body;
        
        jawPivot = scene.sceneObjectsByName[objName].parent.basis;
        jawRotation = scene.sceneObjectsByName[objName].parent.lrotation;
        jawTranslation = scene.sceneObjectsByName[objName].parent.lposition;
        
        var nv = objHeader.vertexCount;
        var nt = objHeader.triangleCount;
        
        //Gingiva before treatment
        addText('o before_' + objName);
        
        for(var v=0;v<nv;v++){
            var point = objBody.vertices.subarray(3*v,3*v+3);
            [xa, ya, za] = PointTransformation(point, jawPivot, jawRotation, jawTranslation);
            addText('v ' + xa + ' ' + ya + ' ' + za);
        }

        for(var v=0;v<nv;v++){
            var point = objBody.normals.subarray(3*v,3*v+3);
            [xa, ya, za] = PointTransformation(point, [0,0,0], jawRotation, [0,0,0]);
            addText('vn ' + xa + ' ' + ya + ' ' + za);
        }

        for(var t=0;t<nt;t++){
            var a = objBody.indices[3*t]+indexOffset;
            var b = objBody.indices[3*t+1]+indexOffset;
            var c = objBody.indices[3*t+2]+indexOffset;
            addText('f ' + a + '//' + a + ' ' + b + '//' + b + ' ' + c + '//' + c);
        }

        indexOffset += nv;
        
        //Gingiva after treatment
        objHeader = scene.sceneObjectsByName[objName].obj.morphTargets[1].init_ctm.header;
        objBody = scene.sceneObjectsByName[objName].obj.morphTargets[1].init_ctm.body;
        
        addText('o after_' + objName);
        
        for(var v=0;v<nv;v++){
            var point = objBody.vertices.subarray(3*v,3*v+3);
            [xa, ya, za] = PointTransformation(point, jawPivot, jawRotation, jawTranslation);
            addText('v ' + xa + ' ' + ya + ' ' + za);
        }

        for(var v=0;v<nv;v++){
            var point = objBody.normals.subarray(3*v,3*v+3);
            [xa, ya, za] = PointTransformation(point, [0,0,0], jawRotation, [0,0,0]);
            addText('vn ' + xa + ' ' + ya + ' ' + za);
        }

        for(var t=0;t<nt;t++){
            var a = objBody.indices[3*t]+indexOffset;
            var b = objBody.indices[3*t+1]+indexOffset;
            var c = objBody.indices[3*t+2]+indexOffset;
            addText('f ' + a + '//' + a + ' ' + b + '//' + b + ' ' + c + '//' + c);
        }

        indexOffset += nv;
    }
})

// teeth
for(var i=0;i<36;i++){

    var objName = 'Tooth_'+i.toString().padStart(2,'0');

    if(scene.sceneObjectsByName[objName]){

        var objHeader, objBody;

        objHeader = scene.sceneObjectsByName[objName].obj.originBuffer.init_ctm.header;
        objBody = scene.sceneObjectsByName[objName].obj.originBuffer.init_ctm.body;            
        
        jawPivot = scene.sceneObjectsByName[objName].parent.basis;
        jawRotation = scene.sceneObjectsByName[objName].parent.lrotation;
        jawTranslation = scene.sceneObjectsByName[objName].parent.lposition;

        var nv = objHeader.vertexCount;
        var nt = objHeader.triangleCount;

        //Tooth before treatment
        addText('o before_' + objName);

        for(var v=0;v<nv;v++){
            var point = objBody.vertices.subarray(3*v,3*v+3);
            [xa, ya, za] = PointTransformation(point, jawPivot, jawRotation, jawTranslation);
            addText('v ' + xa + ' ' + ya + ' ' + za);
        }

        for(var v=0;v<nv;v++){
            var point = objBody.normals.subarray(3*v,3*v+3);
            [xa, ya, za] = PointTransformation(point, [0,0,0], jawRotation, [0,0,0]);
            addText('vn ' + xa + ' ' + ya + ' ' + za);
        }

        for(var t=0;t<nt;t++){
            var a = objBody.indices[3*t]+indexOffset;
            var b = objBody.indices[3*t+1]+indexOffset;
            var c = objBody.indices[3*t+2]+indexOffset;
            addText('f ' + a + '//' + a + ' ' + b + '//' + b + ' ' + c + '//' + c);
        }
        
        indexOffset += nv;

        //Tooth after treatment
        addText('o after_' + objName);
        
        objPivot = scene.sceneObjectsByName[objName].basis;
        objRotation = scene.sceneObjectsByName[objName].motion.controllers[1][4].lastKey.value;
        objTranslation = scene.sceneObjectsByName[objName].motion.controllers[0].map(e => e.lastKey.value);

        // TODO: compose transformations, 
        // then refactor this part into one function.
        // now is repeated 4 times in the code.
        for(var v=0;v<nv;v++){
            var point = objBody.vertices.subarray(3*v,3*v+3);
            [xa, ya, za] = PointTransformation(point, objPivot, objRotation, objTranslation);
            
            point = JSON.parse(JSON.stringify([xa, ya, za])); 
            [xa, ya, za] = PointTransformation(point, jawPivot, jawRotation, jawTranslation);
            addText('v ' + xa + ' ' + ya + ' ' + za);
        }

        for(var v=0;v<nv;v++){
            var point = objBody.normals.subarray(3*v,3*v+3);
            [xa, ya, za] = PointTransformation(point, objPivot, objRotation, objTranslation);
            
            point = JSON.parse(JSON.stringify([xa, ya, za])); 
            [xa, ya, za] = PointTransformation(point, [0,0,0], jawRotation, [0,0,0]);
            addText('vn ' + xa + ' ' + ya + ' ' + za);
        }

        for(var t=0;t<nt;t++){
            var a = objBody.indices[3*t]+indexOffset;
            var b = objBody.indices[3*t+1]+indexOffset;
            var c = objBody.indices[3*t+2]+indexOffset;
            addText('f ' + a + '//' + a + ' ' + b + '//' + b + ' ' + c + '//' + c);
        }        

        indexOffset += nv;

    }
}

var textFile = null;
makeTextFile = function (text) {

    var data = new Blob([text], {type: 'text/plain'});
    const blobUrl = URL.createObjectURL(data);

    // Set link's href to point to the Blob URL
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "invisalignScan.obj";
  
    // Append link to the body
    document.body.appendChild(link);
  
    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
        new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
        })
    );

    // Remove link from body
    document.body.removeChild(link);

    // returns a URL you can use as a href
    return textFile;
};

makeTextFile(fileText);
