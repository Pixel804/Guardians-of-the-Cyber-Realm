from cryptography.fernet import Fernet

key = Fernet.generate_key()
cipher = Fernet(key)

def encrypt_message(message):
    return cipher.encrypt(message.encode()).decode()

def decrypt_message(encrypted_message):
    return cipher.decrypt(encrypted_message.encode()).decode()
