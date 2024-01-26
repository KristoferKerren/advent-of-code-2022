# Generating the coordinates for the 5x5x5 layer of cubes, excluding the 3x3x3 air cube layer

cube_coordinates = []

# Iterating through the range of -2 to 2 for x, y, and z
for x in range(-2, 3):
    for y in range(-2, 3):
        for z in range(-2, 3):
            # Exclude the coordinates for the 3x3x3 air cube layer
            if abs(x) > 1 or abs(y) > 1 or abs(z) > 1:
                cube_coordinates.append((x, y, z))

cube_coordinates[:10]  # Displaying first 10 coordinates as a sample

# Adding an offset of 2 to each coordinate to ensure all values are 0 or more
adjusted_cube_coordinates = [(x + 2, y + 2, z + 2) for x, y, z in cube_coordinates]

print(adjusted_cube_coordinates)  # Displaying first 10 adjusted coordinates as a sample
