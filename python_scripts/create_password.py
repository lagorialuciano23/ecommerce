import random
import string


def generate_secure_password(min_lenght=9, max_lenght=16):
    """
    Genera una contraseña aleatoria que cumple con los siguientes requisitos:
    - Longitud mayor a 8 (mínimo 10, máximo 16 por defecto).
    - Al menos una letra mayúscula.
    - Al menos un carácter especial.
    - Al menos un dígito numérico.
    """

    # --- 1. Definición de Conjuntos de Caracteres ---

    # Caracteres especiales comunes y seguros
    special_characters = "!@#$%^&*()"

    # Combinamos todos los conjuntos posibles de caracteres
    all_characters = (
        string.ascii_letters  # Letras minúsculas y mayúsculas
        + string.digits  # Dígitos (0-9)
        + special_characters
    )

    # --- 2. Determinación de la Longitud ---

    # Escogemos una longitud aleatoria entre el mínimo y el máximo
    lenght = random.randint(min_lenght, max_lenght)

    # --- 3. Asegurar los Requisitos Mínimos ---

    # Nos aseguramos de incluir al menos un carácter de cada tipo:
    # 1. Mayúscula
    # 2. Carácter especial
    # 3. Dígito (buena práctica de seguridad)
    # 4. Minúscula (para usar un total de 4 caracteres iniciales)

    password = [
        random.choice(string.ascii_uppercase),  # Asegura una mayúscula
        random.choice(special_characters),  # Asegura un especial
        random.choice(string.digits),  # Asegura un dígito
        random.choice(string.ascii_lowercase),  # Asegura una minúscula
    ]

    # --- 4. Rellenar el Resto de la Contraseña ---

    # Rellenamos los caracteres restantes hasta alcanzar la longitud deseada
    # Ya usamos 4 caracteres, así que necesitamos 'longitud - 4' más
    for _ in range(lenght - len(password)):
        password.append(random.choice(all_characters))

    # --- 5. Mezclar y Formatear ---

    # Barajamos la lista para que los caracteres requeridos no estén siempre al inicio
    random.shuffle(password)

    # Unimos la lista de caracteres para formar la cadena final (contraseña)
    return "".join(password)


# --- Uso del Script ---
# Ejecutar el script:
# py create_password.py en la terminal

generated_password = generate_secure_password()

print(f"Contraseña generada: {generated_password}")
print(f"Longitud: {len(generated_password)} caracteres")
