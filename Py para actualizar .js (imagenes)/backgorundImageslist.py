import os
folder_path = "C:/Users/ayopr/Desktop/ML/RL/Multilingo/skins/backgrounds"  # Ruta de la carpeta

file_names = os.listdir(folder_path)
formatted_list = ",\n".join([f'    "{file}"' for file in file_names])

js_code = f'var backgroundImages = [\n{formatted_list}\n];\n'

# Escribe la lista en un archivo .js
with open('backgroundImages.js', 'w') as js_file:
    js_file.write(js_code)

print("Lista generada y guardada en backgroundImages.js")
print(len(file_names))