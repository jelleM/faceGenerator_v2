// opmaken van de basisvorm
var basicForm = (function () {

    var radius = Math.floor((Math.random() * 100) + 50);
    var basicPath;
    var jaw;
    var face;

    function _makeBasicForm() {
        basicPath = new Path.Circle({
            center: view.center,
            radius: radius,
            strokeColor: 'black'
        });
    }

    function _makeUnderJaw() {
        var basicLeft = basicPath.bounds.leftCenter;
        var basicBottom = basicPath.bounds.bottomCenter;
        var basicRight = basicPath.bounds.rightCenter;

        jaw = new Path();
        jaw.strokeColor = 'black';

        var leftCheek = new Point(basicLeft);
        leftCheek.x += (basicBottom.x - leftCheek.x) / 2 - Math.floor((Math.random() * 20) + 1);
        leftCheek.y = basicBottom.y + Math.floor((Math.random() * 20) + 1);

        var chin = new Point(basicBottom);
        chin.y += radius / 2 + Math.floor((Math.random() * 5) + 1);

        var rightCheek = new Point(basicRight);
        rightCheek.x += (basicBottom.x - rightCheek.x) / 2 + Math.floor((Math.random() * 20) + 1);
        rightCheek.y = basicBottom.y + Math.floor((Math.random() * 20) + 1);

        jaw.add(basicLeft);
        jaw.add(leftCheek);

        var broadChin = Math.floor((Math.random() * 2) + 1);
        if (broadChin == 2) {
            var leftChin = new Point(chin);
            leftChin.x -= Math.floor((Math.random() * 30) + 10);

            var rightChin = new Point(chin);
            rightChin.x += Math.floor((Math.random() * 30) + 10);

            jaw.add(leftChin);
            jaw.add(rightChin);
        } else {
            jaw.add(chin);
        }

        jaw.add(rightCheek);
        jaw.add(basicRight);
        jaw.add(basicPath.bounds.topCenter);
        jaw.closePath();
    }

    function render() {

        _makeBasicForm();
        _makeUnderJaw();

        jaw.smooth({type: 'catmull-rom', factor: 0.5});
        face = basicPath.unite(jaw);

        basicPath.remove();
        jaw.remove();

        return face;
    }

    return {render: render}
})();

// opmaken van de neus
var noseMaker = (function () {

    var noseShapeDecider = Math.floor((Math.random() * 3) + 1);
    var closedNose = Math.floor((Math.random() * 10) + 1);
    var topFacedNose = Math.floor((Math.random() * 4) + 1);

    function makeNose(basicForm) {

        // Start variables
        var maxWidth = basicForm.bounds.width / 3;
        var center = basicForm.bounds.center;
        var noseWidth = Math.floor((Math.random() * (maxWidth / 2)) + 5);

        // Nose creation
        var nose = new Path();
        nose.strokeColor = 'black';

        var noseTip = new Point(center);
        if (topFacedNose == 1) {
            noseTip.y -= Math.floor((Math.random() * (maxWidth / 1.5)))
        } else {
            noseTip.y += Math.floor((Math.random() * maxWidth))
        }

        var noseLeft = new Point(center);
        noseLeft.x -= noseWidth;

        var noseRight = new Point(center);
        noseRight.x += noseWidth;

        // Variation 1
        var noseLeftTip = new Point(noseTip);
        noseLeftTip.x = noseLeft.x + Math.floor((Math.random() * noseWidth));

        var noseRightTip = new Point(noseTip);
        noseRightTip.x = noseRight.x - Math.floor((Math.random() * noseWidth));

        // Variation 2
        var noseLeftMid = new Point(noseTip);
        noseLeftMid.x -= (noseTip.x - noseLeftTip.x) / 2;
        noseLeftMid.y -= (noseTip.y - noseLeft.y) / 2;

        var noseRightMid = new Point(noseTip);
        noseRightMid.x += (noseRightTip.x - noseTip.x) / 2;
        noseRightMid.y -= (noseTip.y - noseRight.y) / 2;

        // Assembly
        nose.add(noseLeft);

        if (noseShapeDecider != 1) {
            nose.add(noseLeftTip);
            if (noseShapeDecider == 2 && topFacedNose != 1) {
                nose.add(noseLeftMid);
                nose.add(noseTip);
                nose.add(noseRightMid);
            }
            nose.add(noseRightTip);
        } else {
            nose.add(noseTip);
        }

        nose.add(noseRight);
        if (closedNose == 1) {
            nose.closePath();
        }

        // NoseHoles
        if (topFacedNose == 1 && nose.bounds.height > 5) {
            var holeSize = Math.floor((Math.random() * 5));
            var centerNose = new Point(nose.bounds.center);

            var leftCenter = new Point(centerNose);
            leftCenter.x -= Math.floor((Math.random() * ((centerNose.x - noseLeft.x ) / 2)) + holeSize);

            var rightCenter = new Point(centerNose);
            rightCenter.x += Math.floor((Math.random() * ((noseRight.x - centerNose.x ) / 2)) + holeSize);


            var noseholeLeft = new Path.Circle({
                center: leftCenter,
                radius: holeSize,
                strokeColor: 'black'
            });

            var noseholeRight = new Path.Circle({
                center: rightCenter,
                radius: holeSize,
                strokeColor: 'black'
            });
        }

        // details
        nose.smooth({type: 'catmull-rom', factor: 0.5});

        return nose;
    }

    return {makeNose: makeNose}
})();

// opmaken van de ogen
var eyeMaker = (function () {

    function _rightEye(noseRight, noseBottom, faceRight, faceTop) {
        // find center
        var center = new Point(noseRight);
        center.x += ((faceRight.x - noseRight.x) / 2);
        center.y = noseBottom.y - ((noseBottom.y - faceTop.y) / 2);

        var rightEye = new Path();
        rightEye.strokeColor = 'black';

        //drawing eye (left-right top-bottom)
        var r1 = new Point(center);
        var maxDiffR1 = ((center.x - noseBottom.x) / 2);
        r1.x -= Math.floor((Math.random() * maxDiffR1) + (maxDiffR1 / 3));

        var r3 = new Point(center);
        var maxDiffR3 = ((faceRight.x - center.x) / 2);
        r3.x += Math.floor((Math.random() * maxDiffR3) + (maxDiffR3 / 3));

        var eyewidth = r3.x - r1.x;
        var variation = center.x - (r1.x + (eyewidth / 2));

        var r2 = new Point(center);
        var maxDiffR2 = ((center.y - faceTop.y) / 3);
        r2.y -= Math.floor((Math.random() * maxDiffR2) + (maxDiffR2 / 3));
        r2.x -= Math.floor((Math.random() * variation));

        var r4 = new Point(center);
        var maxDiffR4 = ((noseBottom.y - center.y) / 3);
        r4.y += Math.floor((Math.random() * maxDiffR4) + (maxDiffR4 / 3));
        r4.x -= Math.floor((Math.random() * variation));

        // constructing right eye
        rightEye.add(r1);
        rightEye.add(r2);
        rightEye.add(r3);
        rightEye.add(r4);
        rightEye.closePath();
        rightEye.simplify();
        //rightEye.smooth({type: 'catmull-rom', factor: 0.5});

        return rightEye;

        //nose.bounds.selected = true;
        //basicForm.bounds.selected = true;
    }

    function _leftEye(noseLeft, noseBottom, faceLeft, faceTop) {
        // find center
        var center = new Point(noseLeft);
        center.x -= ((noseLeft.x - faceLeft.x) / 2);
        center.y = noseBottom.y - ((noseBottom.y - faceTop.y) / 2);

        var eye = new Path();
        eye.strokeColor = 'black';

        //drawing eye (left-right top-bottom)
        var r1 = new Point(center);
        var maxDiffR1 = ((noseLeft.x - center.x) / 2);
        r1.x -= Math.floor((Math.random() * maxDiffR1) + (maxDiffR1 / 3));

        var r3 = new Point(center);
        var maxDiffR3 = ((noseBottom.x - center.x) / 2);
        r3.x += Math.floor((Math.random() * maxDiffR3) + (maxDiffR3 / 3));

        var eyewidth = r3.x - r1.x;
        var variation = center.x - (r1.x + (eyewidth / 2));

        var r2 = new Point(center);
        var maxDiffR2 = ((center.y - faceTop.y) / 3);
        r2.y -= Math.floor((Math.random() * maxDiffR2) + (maxDiffR2 / 3));
        r2.x -= Math.floor((Math.random() * variation));

        var r4 = new Point(center);
        var maxDiffR4 = ((noseBottom.y - center.y) / 3);
        r4.y += Math.floor((Math.random() * maxDiffR4) + (maxDiffR4 / 3));
        r4.x -= Math.floor((Math.random() * variation));

        // constructing right eye
        eye.add(r1);
        eye.add(r2);
        eye.add(r3);
        eye.add(r4);
        eye.closePath();
        eye.simplify();
        //rightEye.smooth({type: 'catmull-rom', factor: 0.5});

        return eye;

        //nose.bounds.selected = true;
        //basicForm.bounds.selected = true;
    }

    function _makePupils(leftEye, rightEye) {
        // restrictions
        var leftEyeWidth = leftEye.bounds.width;
        var leftEyeHeight = leftEye.bounds.height;
        var rightEyeWidth = rightEye.bounds.width;
        var rightEyeHeight = rightEye.bounds.height;

        // find maxSize of the pupil
        var maxSize = leftEyeWidth;
        ((maxSize > leftEyeHeight) && (maxSize = leftEyeHeight));
        ((maxSize > rightEyeWidth) && (maxSize = rightEyeWidth));
        ((maxSize > rightEyeHeight) && (maxSize = rightEyeHeight));

        maxSize = Math.floor((Math.random() * (maxSize / 5)) + (maxSize / 8));

        // movement of pupils
        var upDown = Math.floor((Math.random() * 2) + 1);
        var leftRight = Math.floor((Math.random() * 2) + 1);

        var movementLeft = new Point(leftEye.bounds.center);
        var movementRight = new Point(rightEye.bounds.center);

        var plusHorizontal = Math.floor((Math.random() * (leftEyeWidth / 2)));
        if (leftRight === 1) {
            movementLeft.x += plusHorizontal;
            movementRight.x += plusHorizontal / (leftEyeWidth / 2) * (rightEyeWidth / 2);
        } else {
            movementLeft.x -= plusHorizontal;
            movementRight.x -= plusHorizontal / (leftEyeWidth / 2) * (rightEyeWidth / 2);
        }

        var plusVertical = Math.floor((Math.random() * (leftEyeHeight / 2)));
        if (upDown === 1) {
            movementLeft.y += plusVertical;
            movementRight.y += plusVertical / (leftEyeHeight / 2) * (rightEyeHeight / 2);

        } else {
            movementLeft.y -= plusVertical;
            movementRight.y -= plusVertical / (leftEyeHeight / 2) * (rightEyeHeight / 2);
        }

        // 'is inside eyes'-test
        if (!leftEye.contains(movementLeft) || !rightEye.contains(movementRight)) {
            movementLeft = new Point(leftEye.bounds.center);
            movementRight = new Point(rightEye.bounds.center);
        }

        // creation
        var leftpupil = new Path.Circle({
            radius: maxSize,
            center: movementLeft,
            strokeColor: 'black'
        });

        var rightpupil = new Path.Circle({
            radius: maxSize,
            center: movementRight,
            strokeColor: 'black'
        });

        // intersect operation

        var randomColor = Math.floor(Math.random() * 360);

        var newLeftpupil = leftEye.intersect(leftpupil);
        leftpupil.remove();
        newLeftpupil.fillColor = '#4adbc4';
        newLeftpupil.fillColor.hue = 0;
        newLeftpupil.fillColor.hue += randomColor;


        var newRightpupil = rightEye.intersect(rightpupil);
        rightpupil.remove();
        newRightpupil.fillColor = '#4adbc4';
        newRightpupil.fillColor.hue = 0;
        newRightpupil.fillColor.hue += randomColor;
    }

    function makeEyes(basicForm, nose) {
        // restrictions
        var noseLeft = nose.bounds.leftCenter;
        var noseRight = nose.bounds.rightCenter;
        var noseBottom = nose.bounds.bottomCenter;
        var faceLeft = basicForm.bounds.leftCenter;
        var faceRight = basicForm.bounds.rightCenter;
        var faceTop = basicForm.bounds.topCenter;

        // making the eyes
        var righteye = _rightEye(noseRight, noseBottom, faceRight, faceTop);
        var lefteye = _leftEye(noseLeft, noseBottom, faceLeft, faceTop);

        // making the pupils
        _makePupils(lefteye, righteye);
    }

    return {makeEyes: makeEyes}
})();

// opmaken van de mond
var mouthMaker = (function () {
    function makeMouth(face, nose) {
        var mouth = new Path();
        mouth.strokeColor = 'black';

        var center = nose.bounds.bottomCenter;
        var faceBottom = face.bounds.bottomCenter;
        var faceLeft = face.bounds.leftCenter;
        var faceRight = face.bounds.rightCenter;

        var m2 = new Point(center);
        var maxDiffM2 = faceBottom.y - center.y;
        m2.y += Math.floor((Math.random() * maxDiffM2));

        var m1 = new Point(center);
        var m3 = new Point(center);
        var maxDiffMouthCornersY = (faceBottom.y - center.y) / 2;
        m1.y += maxDiffMouthCornersY;
        m3.y += maxDiffMouthCornersY;
        if (Math.random() > 0.5) {
            m1.y += Math.floor((Math.random() * maxDiffMouthCornersY));
            m3.y += Math.floor((Math.random() * maxDiffMouthCornersY));
        } else {
            m1.y -= Math.floor((Math.random() * maxDiffMouthCornersY));
            m3.y -= Math.floor((Math.random() * maxDiffMouthCornersY));
        }
        var maxDiffMouthCornersX = (faceRight.x - faceLeft.x) / 2;
        var diffMouthCornersX = Math.floor((Math.random() * maxDiffMouthCornersX));
        m1.x -= diffMouthCornersX;
        do {
            m1.x += 5;
        } while (!face.contains(m1));
        m3.x += diffMouthCornersX;
        do {
            m3.x -= 5;
        } while (!face.contains(m3));


        mouth.add(m1);
        mouth.add(m2);
        mouth.add(m3);

        if (Math.random() > 0.7) {
            var m4 = new Point(m2);
            m4.y = m1.y;
            mouth.add(m4);
            mouth.closePath();
        }

        mouth.simplify();
    }

    return {makeMouth: makeMouth}
})();

// opmaken van de oren
var earMaker = (function () {

    function _makeSingleEar(attachments) {
        var ear = new Path({
            strokeColor: 'black'
        });
        ear.add(attachments[0]);
        ear.add(attachments[1]);
        ear.add(attachments[3]);
        ear.add(attachments[2]);
        ear.simplify(50);

    }

    function makeEars(face) {
        var leftFaceAttachments = [];
        var rightFaceAttachments = [];
        var amount = 20;

        var topRandom = Math.abs(Math.random()*30);
        var bottomRandom = Math.abs(Math.random()*topRandom);

        for (var i = 0; i < amount + 1; i++) {
            if (i == 1 || i == 10 || i == 12 || i == 19) {
                var offset = i / amount * face.length;
                var point = face.getPointAt(offset);
                var normal;
                
                if(i == 1 || i == 10) {
                    normal = face.getNormalAt(offset) * bottomRandom;
                }else{
                    normal = face.getNormalAt(offset) * topRandom;
                }

                if (i == 10 || i == 12) {
                    leftFaceAttachments.push(point);
                    leftFaceAttachments.push(point + normal);
                } else {
                    rightFaceAttachments.push(point);
                    rightFaceAttachments.push(point + normal);
                }
            }

        }

        _makeSingleEar(leftFaceAttachments);
        _makeSingleEar(rightFaceAttachments);
    }

    return {makeEars: makeEars}
})();

// maken van het gezicht
var faceGenerator = (function () {
    function render() {
        var basic = basicForm.render();
        var nose = noseMaker.makeNose(basic);
        eyeMaker.makeEyes(basic, nose);
        mouthMaker.makeMouth(basic, nose);
        earMaker.makeEars(basic);
    }

    return {render: render}
})();

// uitvoering
faceGenerator.render();
