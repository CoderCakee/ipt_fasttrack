import qrcode

def generate_qr(request_id):
    # The data inside the QR is just the ID
    data = str(request_id)

    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill='black', back_color='white')
    # Save 'img' to your media folder or return it to the frontend to print
    img.save(f"media/qr_codes/request_{request_id}.png")

img = qrcode.make('test data')
print(type(img))  # Should print <class 'qrcode.image.pil.PilImage'>
print("Library is working!")