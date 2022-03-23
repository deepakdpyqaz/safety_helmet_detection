import cv2
import numpy as np
import time
import copy
# Load Yolo
net = cv2.dnn.readNet("yolov4-tiny-custom-helmet_best.weights", "yolov4-tiny-custom-helmet.cfg")
classes = ["Without helmet","With helmet"]
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
def processImage(img):
    # Loading image
    height, width, channels = img.shape

    # Detecting objects
    blob = cv2.dnn.blobFromImage(img, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
    net.setInput(blob)
    outs = net.forward(output_layers)


    # Showing informations on the screen
    class_ids = []
    confidences = []
    boxes = []
    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.5:
                # Object detected
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)

                # Rectangle coordinates
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)


    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
    colors = [(0,0,255),(0,255,0)]
    font = cv2.FONT_HERSHEY_PLAIN
    out = []
    for i in range(len(boxes)):
        if i in indexes:
            label = str(classes[class_ids[i]])
            out.append((boxes[i],label))
    return out

