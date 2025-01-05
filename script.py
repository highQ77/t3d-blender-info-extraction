# https://blender.stackexchange.com/questions/39677/how-do-you-get-an-objects-position-and-rotation-through-script
# blender z / y 跟 threejs 相反，下方設置有調整

import json
import bpy

sceneData = []

total = len(bpy.data.objects)
print("There are ",total," objects in the scene")

for obj in bpy.data.objects:
    sceneData.append({
        "name": obj.name,
        "type": obj.type,
        "location": {
            "x": -bpy.data.objects[obj.name].location.x,
            "y": bpy.data.objects[obj.name].location.z,
            "z": bpy.data.objects[obj.name].location.y
        },
        "rotation_euler": {
            "x": -bpy.data.objects[obj.name].rotation_euler.x,
            "y": bpy.data.objects[obj.name].rotation_euler.z,
            "z": bpy.data.objects[obj.name].rotation_euler.y
        },
         "scale": {
            "x": -bpy.data.objects[obj.name].scale.x,
            "y": bpy.data.objects[obj.name].scale.z,
            "z": bpy.data.objects[obj.name].scale.y
        },
          "dimensions": {
            "x": -bpy.data.objects[obj.name].dimensions.x,
            "y": bpy.data.objects[obj.name].dimensions.z,
            "z": bpy.data.objects[obj.name].dimensions.y
        },
    })
    print(obj.name)
    # print(bpy.data.objects[obj.name].location)
    # print(bpy.data.objects[obj.name].rotation_euler)
    # print(bpy.data.objects[obj.name].scale)
    
layout = json.dumps(sceneData)
f = open("SceneData.js", "w")
f.write("export let sceneData="+layout)
f.close()