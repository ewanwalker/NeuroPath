import nibabel as nib
from nilearn import plotting
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import numpy as np

def render_nifti_slices(file_path: str, axis: int = 2, step: int = 1) -> list[str]:
    img = nib.load(file_path)
    data = img.get_fdata()

    nonzero = data[data > 0]
    vmin = float(np.percentile(nonzero, 2))
    vmax = float(np.percentile(nonzero, 98))

    slices = []
    n = data.shape[axis]

    for i in range(0, n, step):
        fig, ax = plt.subplots(1, 1, figsize=(5, 5), facecolor="black")
        ax.axis("off")

        if axis == 0:
            sl = data[i, :, :]
        elif axis == 1:
            sl = data[:, i, :]
        else:
            sl = data[:, :, i]

        ax.imshow(sl.T, cmap="gray", origin="lower", vmin=vmin, vmax=vmax)
        ax.set_title(f"z={i}", color="white", fontsize=8, pad=2)

        buf = BytesIO()
        plt.savefig(buf, format="png", bbox_inches="tight",
                    facecolor="black", pad_inches=0.05)
        plt.close()
        buf.seek(0)
        slices.append(base64.b64encode(buf.read()).decode("utf-8"))

    return slices