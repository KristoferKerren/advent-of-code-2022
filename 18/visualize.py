import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# The list of coordinates
coordinates = [
    (11, 11, 18), (13, 12, 16), (12, 11, 3), (14, 3, 6), (15, 12, 4), (4, 8, 10), (9, 2, 13), (4, 5, 10),
    (12, 17, 6), # ... [Truncated for brevity]
    # Full list of coordinates goes here
    (13, 12, 18), (6, 9, 1), (11, 14, 5)
]

# Extracting x, y, and z coordinates
x = [coord[0] for coord in coordinates]
y = [coord[1] for coord in coordinates]
z = [coord[2] for coord in coordinates]

# Creating a 3D plot
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Plotting each cube
for xi, yi, zi in coordinates:
    ax.bar3d(xi, yi, zi, 1, 1, 1, color='b', alpha=0.5)

# Setting labels
ax.set_xlabel('X axis')
ax.set_ylabel('Y axis')
ax.set_zlabel('Z axis')
ax.set_title('3D Visualization of Cubes')

# Show the plot
plt.show()
