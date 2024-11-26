def test_generator(client):
    response = client.get("/divegenerator/?num_jumps=12&class=aaa")

    assert response.status_code == 200, "Status code not 200"
    assert b"<title>FS4 Generator</title>" in response.data, \
        "Incorrect page title"

    for char in range(ord('a'), ord('q') + 1):
        if char == ord('i'):
            continue
        filename = f"{str(chr(char))}.png"
        assert bytes(filename, 'utf-8') in response.data, \
            f"{filename} not found in response data"

    for n in range(1, 23):
        filename = f"{str(n)}.png"
        assert bytes(filename, 'utf-8') in response.data, \
            f"{filename} not found in response data"
