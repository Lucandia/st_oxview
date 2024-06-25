import streamlit.components.v1 as components
import os

parent_dir = os.path.dirname(os.path.abspath(__file__))
oxview_static_folder = os.path.join(parent_dir, "oxview_src")

_component_func = components.declare_component(
    "oxview_frame",
    path=parent_dir,
)

def oxview_from_file(configuration=None, topology=None, forces=None, pdb=None, width='99%', height=500, **kwargs):
    """Create an OxView component loading the data from the specified files and displaying it in a frame.
    The files must be in the static folder of the app."""
    srcs = [configuration, topology, forces, pdb]
    oxview_extension = ["dat", "top", "txt", "pdb"]
    for i in range(len(srcs)-1, -1, -1):
        if not srcs[i]:
            srcs.pop(i)
            oxview_extension.pop(i)
        else:
            # Construct the URL to the static file
            srcs[i] = os.path.sep + 'app' + os.path.sep + 'static' + os.path.sep + os.path.basename(srcs[i])
    if not srcs:
        srcs = ['']
        oxview_extension = ['']
    
    component_value = _component_func(files_path=srcs, files_extension=oxview_extension, width=width, height=height, **kwargs)
    return component_value