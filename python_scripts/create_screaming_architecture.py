import os
import sys

def create_screaming_architecture(nombre_carpeta_padre):
    """
    Crea una carpeta padre y una estructura de subcarpetas estándar para un proyecto.

    Args:
        nombre_carpeta_padre (str): El nombre de la carpeta principal del proyecto.
    """
    # Lista de las subcarpetas que se crearán
    subcarpetas = [
        "components",
        "context",
        "helpers",
        "hooks",
        "pages",
        "services"
    ]

    print(f"Iniciando la creación del proyecto: '{nombre_carpeta_padre}'")

    try:
        # Crear la carpeta padre principal.
        # exist_ok=True evita que dé un error si la carpeta ya existe.
        os.makedirs(nombre_carpeta_padre, exist_ok=True)
        print(f"Carpeta principal '{nombre_carpeta_padre}' creada con éxito.")

        # Recorrer la lista de subcarpetas y crear cada una
        for carpeta in subcarpetas:
            # os.path.join() une las rutas de forma inteligente para que funcione
            # en cualquier sistema operativo (Windows, Mac, Linux).
            ruta_completa = os.path.join(nombre_carpeta_padre, carpeta)
            os.makedirs(ruta_completa, exist_ok=True)
            print(f"  -> Subcarpeta '{carpeta}' creada.")

        # Modificación: Crear un archivo .gitkeep en cada subcarpeta vacía.
            # Esto asegura que Git pueda rastrear la estructura de carpetas
            # aunque no contengan otros archivos.
            #
            # 1. Definimos la ruta completa del archivo .gitkeep.
            ruta_gitkeep = os.path.join(ruta_completa, '.gitkeep')
            
            # 2. Creamos el archivo vacío.
            #    open(ruta, 'w') abre un archivo para escribir (y lo crea si no existe).
            #    .close() lo cierra inmediatamente, dejándolo con 0 bytes.
            open(ruta_gitkeep, 'w').close()
            print(f"     + Archivo '.gitkeep' añadido a '{carpeta}'.")
            #
            # --- FIN DE LA MODIFICACIÓN ---

        print("\nEstructura de carpetas creada exitosamente!")

    except OSError as e:
        # Capturamos posibles errores, como problemas de permisos.
        print(f"Error al crear las carpetas: {e}", file=sys.stderr)
        sys.exit(1) # Termina el script con un código de error

# Este bloque se asegura de que el código solo se ejecute
# cuando corres el archivo directamente.
if __name__ == "__main__":
    # Pedimos al usuario que ingrese el nombre del proyecto.
    nombre_del_proyecto = input("Por favor, ingresa el nombre de la carpeta principal del proyecto: ")

    # Verificamos que el usuario haya ingresado un nombre.
    if nombre_del_proyecto:
        create_screaming_architecture(nombre_del_proyecto)
    else:
        print("No ingresaste un nombre. El script no se ejecutará.")



## py C:\Users\TuUsuario\Desktop\create_screaming_architecture.py
## py C:\Users\gabom\Desktop\dswGit\ecommerce\python_scripts\create_screaming_architecture.py