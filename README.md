# Streamlit Oxview Component

A Streamlit component for the display of coarse-grained DNA/RNA 3D models.

This is a simple component that renders coarse-grained DNA/RNA 3D models. It is a wrapper around the [oxdna-viewer](https://github.com/sulcgroup/oxdna-viewer.git).

## Installation

```
pip install st_oxview
```

## Example

![Alt Text](example.png)

Look at the [example](https://stoxview.streamlit.app/) for a simple example:

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://stoxview.streamlit.app/)

## Usage

**IMPORTANT**: The component requires the configuration, topology, and forces files (or pdb file) to be saved in the static folder of streamlit. The component will not work if the files are not saved in the static folder.

### Display from file paths

```
import streamlit as st
from st_oxview import oxview_from_file

# the conf_file_name is the name of the configuration file in the static folder
# the topo_file_name is the name of the topology file in the static folder

oxview_from_file(configuration=conf_file_name, # path to the configuration file
                 topology=topo_file_name,      # path to the topology file
                 forces=None,                  # path to the forces file
                 pdb=None,                     # path to the pdb file
                 width='99%',                  # width of the viewer frame
                 height='500',                 # height of the viewer frame
                 key=None)                     # streamlit component key

```

## How to cite:

Please include this citation if the OxView Component is used in an academic study:

```
Lucandia. Lucandia/st_oxview; Zenodo, 2024. https://zenodo.org/doi/10.5281/zenodo.12515559.
```

[![DOI](https://zenodo.org/badge/819322738.svg)](https://zenodo.org/doi/10.5281/zenodo.12515559)


## License

Code is licensed under the GNU General Public License v3.0 ([GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.en.html))

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%20v3-lightgrey.svg)](https://www.gnu.org/licenses/gpl-3.0.en.html)
