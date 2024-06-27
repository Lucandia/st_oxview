import streamlit.components.v1 as components
import os

parent_dir = os.path.dirname(os.path.abspath(__file__))
oxview_static_folder = os.path.join(os.path.join(parent_dir, "oxview_src"), "static")

_component_func = components.declare_component(
    "oxview_frame",
    path=parent_dir,
)

def oxview_from_text(configuration=None, topology=None, forces=None, pdb=None, width='99%', height=500, **kwargs):
    texts = [configuration, topology, forces, pdb]
    names = ["struct.dat", "struct.top", "structforces.txt", "struct.pdb"]
    oxview_file_type = ["configuration", "topology", "forces", "file"]
    oxdna_file_text = ''
    for text, name, ox_name in zip(texts, names, oxview_file_type):
        if text is not None:
            try:
                with open(os.path.join(oxview_static_folder, name), "w") as f:
                    f.write(text)
                oxdna_file_text += f'&{ox_name}=.%2Fstatic%2F{name}'
            except Exception as e:
                print(e)
                _component_func(files_text = '', width=width, height=height, **kwargs)
                return False
    _component_func(files_text = oxdna_file_text[1:], width=width, height=height, **kwargs)
    return True

def oxview_from_file(configuration=None, topology=None, forces=None, pdb=None, width='99%', height=500, **kwargs):
    srcs = [configuration, topology, forces, pdb]
    names = ["struct.dat", "struct.top", "structforces.txt", "struct.pdb"]
    oxview_file_type = ["configuration", "topology", "forces", "file"]
    oxdna_file_text = ''
    for src, name, ox_name in zip(srcs, names, oxview_file_type):
        if src is not None:
            try:
                with open(src, "r") as f:
                    src_content = f.read()
                with open(os.path.join(oxview_static_folder, name), "w") as f:
                    f.write(src_content)
                oxdna_file_text += f'&{ox_name}=.%2Fstatic%2F{name}'
            except Exception as e:
                print(e)
                _component_func(files_text = '', width=width, height=height, **kwargs)
                return False
    _component_func(files_text = oxdna_file_text[1:], width=width, height=height, **kwargs)
    return True