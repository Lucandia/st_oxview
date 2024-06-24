# Streamlit Oxview Component

A Streamlit component for the 3D visualization of coarse-grained DNA/RNA

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

### Display from file paths

```
import streamlit as st
from st_oxview import oxview_from_file

oxview_from_file(configuration=path_to_conf, # path to the configuration file
                 topology=path_to_topo,      # path to the topology file
                 forces=None,                # path to the forces file
                 pdb=None,                   # path to the pdb file
                 width='99%',                # width of the viewer frame
                 height='500',               # height of the viewer frame
                 key=None)                   # streamlit component key

```

### Display from text

```
import streamlit as st
from st_oxview import oxview_from_text

with open("configuration.dat", "r") as f:
    conf_text = f.read()

with open("topology.top", "r") as f:
    topo_text = f.read()

oxview_from_file(configuration=conf_text, # text of the configuration file
                 topology=topo_text,      # text of the topology file
                 forces=None,             # text of the forces file
                 pdb=None,                # text of the pdb file
                 width='99%',             # width of the viewer frame
                 height='500',            # height of the viewer frame
                 key=None)                # streamlit component key


```

## How to cite:

Please include this citation if the Streamlit oxView Component is used in an academic study:




