
//获取应用实例
const Config = require("../../config")
const Common = require('../../utils/common')
var Api = require("../../utils/api")

const app = getApp()

const { regeneratorRuntime } = global

Page({
  data: {
    isVip:0,
    reflashUrl: true,
    appdownloadHidden: true,
    bRotateC: '',
    stateShow: 0,
    successRemark: '恭喜发财，大吉大利',
    popupHidden: true,
    popBenas:false,
    imgUrl: 'https://v.3721zh.com/static/img/bean_detail_logo.d3495ac.png',
    username: '',
    inforlist: {},
    noGetBeanNum:0,
    errorImg: 'https://zhkj.oss-cn-shanghai.aliyuncs.com/nHelp/w_newLogo.png',
    w_beanfaces: "data: image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAADAFBMVEUAAAD3viTyqQPyqQfwowHwoQD/5U3 / 5036zjX/7FTyqAPxpAD/61PypwX / 6VP0tRXwoQD/7130swz/8GHzrgX5xyb / 6lz/7mDyqAHyqADwpAP/4UDxowD / 61X/7Vr+4EfzsAvwoQD3uxnyrQP/8F / woQD / 72T/5VnxogD91zL3vRr/7V / 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",
    w_redLogo01: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAABuCAYAAADGWyb7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjA3M0YwQzIwQjBEMTFFOTlDMENFQzc1MjMyRTc5MkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjA3M0YwQzMwQjBEMTFFOTlDMENFQzc1MjMyRTc5MkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMDczRjBDMDBCMEQxMUU5OUMwQ0VDNzUyMzJFNzkyRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMDczRjBDMTBCMEQxMUU5OUMwQ0VDNzUyMzJFNzkyRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuilNa0AABgrSURBVHja7F0JnFTFmf9XH9NzMTMMDKfcRAU5VIhcRhFFBZWQ5VAw3iZZf7hEgxEVgvFY8Up2NeK6mojGn8Z7TeIa1wOQUw5BTiVy3wJz98z09FVb9fq911X1Xg8zQx9vYL7ho6ffdNd7r/71nfVVPUIpRSu1PHK1dkErcK3UClwrtQJ3ipKnBV6zm3FvxoMZ92Hck3F3xiU6F+r31Ub/fDXjMONKxsd03sd4D+OdjDcy3sU40pI6gbQArzKX8cWML2I8ivEQ/VgyqZbxV4xXMv5C59pW4JpOnRhPZnyNDlh2ms8fYLyU8QeM32Jc1gpcYvLpYN3CeLSuEp1A9Yw/Yvyq/hpqBS5GXRjPZPwzxsUOV9tc8l5i/CzjQ6crcNzBmMv4esZZLcxBCjL+C+OHdcfmtACuM+OHGN/M2NvCvXKuNl9h/CDjw6cqcFyqZjF+gHH+KRZW+RnPZ/y0Lo2nDHAjddvQ/xSPi7fptnplS8+ccE/xd4yXnQagQb/HZfo9+1qqxPVj/CbjQTg9aRPj6xh/05IkbirjNacxaNDvfY3eF44HjuhG+s1T0AFpDuXrfTFf7xtHqspsPbswtRUvW3qH8Y2IpdMcAxzPxP8NsVRVKyWmJYwnIDZjkXHg+DTKx4yHt+LSKFrN+ErGFZkEjkvap4yHteLRZPDGnozknYxzkqOrx1bQmk7D9L7LTTdw3EN6KRU2jR46gLKpE3G4UweUTRwPundP2ns1umsHyq65QruG8mmTEP0+JWnI0XofNs/b5KqyGTyfpogqfnELPdSxhB7q1EF7LZ8+haabyib/OHYNOlfecXsqTze/ORg0R+KmMJ6dqtEeXLcehMQHYXDTlrRLXP2qtbpeIdq11G9N6TXM1vs0paqSp7FeTnYwKWmAYFAbUeBMCDJBNBLWfxEtQ8qIN74QTczlNgU4X1oyIlTS4ynus4T2w7yYNM2e5CE2MetLBXCPIR25RxEoLnEOqIlJk+AP0vs4qcDx+bS70t5T3BBnCCnRzqZxsvkuva+TEoBz8V3fGB1cccN1tqNTPIWAiWU082OBL5aBhsLxA24Xsgb0g6djR0ubhkCKgqn+Ln5WVMc0gUBHjh5FcOMWGcS8XOSMHNbgddtJp/lZ3QIUvfZmYzDhk7HnI1ZddlLA3YdYdvuEdKRvL9CaWmsviq9qz6t3bnYAMU0eEc2f1HbsKP+s+5zu8I0azDo5m33e+C7VO45ojWiudIUf9Ys3ILz7sHld/PtUHQH6dxq8TuHz9m0IH83PQ6cduxsrefczfvxkgOOFqdsZFzTmbGU/Hof6NesTAkEtYiFAonaCIlbmMRuRy7tlHLJnXgdKrI6OqvK0dgL1qHvwRdR9ss4CiDlg7PrFDqhEABMSvzv23jd8KIo/+KixwPFU2JlcFppr4x5uLGiaTh0+wgY0uSOINCJ1r1EZpWo4YHYS1XWc8FlXh0L4ZkzVJVP+0aRMhFvvSZLtQ86vpsfbE3ScEeBa9F7C3xPYSKMto2+GNSkH30bv+2Y5J7zu8eYmJS+vmmC9OSLfKJV6kMidpzoHXEKUCMHsKP3v7jNKQDxu87jR6WbnUwUMgzoWMwC98daNgaIzESTGYrTEtvRrlD5jACYMyJzxE5rqqPCK7j7NAY4Xqzap7tE16Fxkjx4l4EXkQWneiNJZoJKagtDRhsokRoeKHcbeh7fvB62sNgEypNMcKyTWbgyIuO2Lbt3FVGYofk5R6oXUkjUsUVSpocJV9a8DyNvPHn0hXIPPbSpwHh2DJgHHy8Kvb44/Wzj3twxuD6jQ6VRUkcaoNjpBVZGqgyJKkDiSDVVUUw//3BeYga3U7WDcHpoqUzJ77C97DsP/8MsWhW5KWYOBG7VIIZEGl6ht2HUwbVAw58HmhgdMn6NbU4C7G80sC3cNGIy2D86zqBaqqBLJKbFTk6ozYufr698NLtuM8qtmwX/nkyyeCJqeZFxqdQna/z2qb30EZZPmMEk9EDuHIKXxy6LSdVgHHKRroFQcLIK2Ycd5X7gHDm4ucByDmY0FjteO3HoyUWT27f+Kglm/lG5UVJ0nSjdRamN3VPAUB4bWh1G/fAvqnngNNBK1CklNHfyP/gmhDTtZsBaJe4KSDFHLzInkIdLEAaqoEYzrL7znbq0vTpJuhc0yM7twgIvn60nJsr/9Birm/gbRar9kl0S7ZZoFo4OyvAyEoK1tIURRp3ZxInvN+uFZyLluLNxndmfBfITZsx3wv/oxIjsONizBCeJPkp/PgK9B/FJtYj/Bk3QVtEHRo4/AN3V6sjIqP1UxsQPuc8ZjkpavPXQQNc89A/87b4NW11qk0Dh/1nmD0OaOGQzoOYgcK7WJlxKkXuzc8IZSK3btGME8sW/Xc1ZfFM76Nfz/9RzqN2yR4zYJ4FzkXzsVeTNmgnQ5I5mpsEWML20IOB5wM+Wf/EWFtLoa4ZVLEd68GZHvjyAaCMBVXAxvr97wDh8J19mxjNrRgf0ROV5qZkXsglpqEzRbwELi+EpUjBYJsgnCvWf3RfslseUA0W+2IbR6FcK7dyFaxq6TxYSejp3hGTQInhE/AmnTJhU5TK77u4oBubp4fxJStBKU35D3iqs0bsy8TjxysLE7SkqKKnFVg6rQTuKVrA5VwBabdPXrDx/n9Ka9uS/CJ1v/kMg5mQAnkOHhCZ4dsUgSbXDehShAiflOqjgRFidIiMGkuDOzdI0a5BnEJ0gvzvz1ESmFb3roPJFc0h75N0yHd8BALZldv/QL+N//gHmJUYvTo0ocFVUqo9yrxyP70kuZI1GI8LfbUP3GG4gcOCx9j4phQebpIh0jv2rjxjP+30xf3dFB/SXnxOjIrCHnot3C14CSDqg8fhy5XPX6fIisWIpjN90I6q9NYNZk58blzULxH19kKns86pmdDfj9KGzfHqiqRMXPb0HdkuVy4lhzTvqg5ItVTgDvagMjUVX+CE4hJcgmOT60ff6/cZSFCbcOH4FLS0owuqgtXnvySbhHXYS2v5knp8zEzIVo19hrway74Ll8HBbcfx8ublOgtXXHmDGoYG0XPvcic5gKjQSnnOFxBl1oZ+NGOQM0K4A5l18GV/eeeH7OA9i0+kvtI/WBOjwzeza+Xr4MvslTtYw/FdNoSu7ReO+b/lNsWrkCrzz+FELh2M4Xaxcvxn/86m4QJnl5EycmtJsOoJEqcNyTHOKIS1NmE3hne/v01X6dt/AVLPjkE3Tp0cPEd/3iJUBePjzduspfVVx77WbbFsDVoRMGj7oQf9+zGxNuusn82+rPF8Vc/9595NQcIU5xTqBj5BadE94zuY5Tk3osF62IrY94d8EC/Pmpp3Bk/35TeXXo1k37TqS8UsnIxKI00b5Fq/xcVLFzxw78fuYvsWbR4ngA26279hqpKLfEhsQ50penY7XdkLiBcCTFOq32s8+AYD1KunTF0YPxfWHOGTIUY6+9FpE1qxAtLRNmi6h9Jp95n6Eli9CBtXNo7z5zkjWLOSwzHnuMIRtF3aefxqeGEsxaZJgGqhLnHBMnJo95f+89gNrfPYFL7p+HtzZtxMp/fIzijh0wZsoU+MJhlD40T0ldEUtKzZDkin9/GO3+50O8/vUGLH7vPVSWluKiCRNwRt++CLzwHIKbtlqSz8RZ9q6vCFxPp1yV7awz67iqZxdoFVg97piBXvfM0lRemDkmpU/Oj1VlKXNpVJwHFNJb4e92o2zSBBTeez/GM2kl2dnaIg//nHtR/adXEpdvOYd6inHcPxBbbJdx0nKVx45L2XYLuNyDDNQ3LYlslw7jL3zSl5cDKvlKUWp5HGfkKh1AfBHpOMPGtXeeeaP2M+L8T4F6e4dG6XDY5TAViaLBkH3MZ8yviROszqD2YjjQzkkOiRh8Q1F/RMopJpYwqtZ/CM1b8p7mrLxN/aezwgELcMUOg80SOMPOwzMDN6WYx0wa25/BsH0Wp4Mo53Ve5oRTW9E5ccym2pbOtKvTtCuTgxj+2dS5K2qQqoVBUi0MlPk+R6lKKQBvA6eJXEKng/3Ly4F3QA94enWFu0dnuDq1h6s4n43FArhyc0B93lgJBP8udzx4KURdgMV61YiWV4EePobIviMI7zyE0LY9oP6AIFknmDnPPOWLwDku6JayFjlZ8I0cAO+Ic+A5py/ID7qDuF26MwFLCZ6o4DiIYECDFMLVtSNcyudpOAL63T6Et+xEaPUW1C/frBUeQS0NdBgZwFU7RuoMx4K56dljzoPvyhFwDx8AkpMt2Tlqk4rSaiphvzwqVpJOrfbK44KrXy94+/VE1pTLkFtXh8iXDMCPViGwaL051+cg8ovARR1j4wqykT9pIrL+ZQxQUigs1xE6Xddo0roAaYGHXg4rBeNU+KoCsP5ee83JgXv0UORyPl6B+vcXIfTld04CLiIG4Hxf4V6Z1ZBRRGp2I/z9Js2GiaAQyOGAqiLNjpdW+1DLah0R/PhnDXNGlBJ24XOBILwdBjL72ZN9MON+3B6OlSFxpZkELlp/FOGqbWwsBTTQRAlSV9tInSqsf4tXE9O4RNk5qCQubaKEiu2Kg0NjZmPD1dtBavfDVdAPbl+HTAJXKqrK45mRsghClVsRDRw0VZVUx22j2lQwze8Rq0SaMZvQ2InK8cz2bZyeaKSWeaVfgeZ0g4cByDykTPTaMRG4venX1AGEeCeEq+OgwC5oJiZ4Elg0Dlbci48v+ohHFMQEngjH7OJGQmS1SwXpFB2dCJM8GqqEt+0QFlWl+yEkMaxcgt5Mn6CF/QiVrkA0XKXkM6yutykVIEpFnr4WR3i1s3WyjRSdSmoufIyfOy7B4rIsqS09I8MHXKh0FRD2Z8LGmcDtSNtpwzUIl61mvkgoruZEL4/IoIn2TK3YMjtcXOsNm7J14fsSiNTAj9jIuHVBpDgQNLij9QiWr2UaP63PT9ohArc5TaKGYMUGDTTR0aOia0/FRYOweI2ijRNVrKhK7WI8i8oj1vSa3XtjoYkYUojhA2UqP1K+QbPXaaLNqsTVpVzYqr5l/1XLEkMgSYKR/JXUHoWt6rOoUqHD7XZIocJORTYLhc11dFKgD9lZkhwl/SfK7ilS/W06QKtRJY4Pl3UpdflDFYjU7ZenzpQVo2pALS4xNkY81XUcBW1YLSpbZkgSTK3H4iGIutGAcJ007uWKNpmz4bCkmNYbAbgYTa5IKXD+nQ1rUUptnAEiOwVmgp9YVJ/4mkiazP0YhPjNKqmwVZ8xG2kEk7BoCG30n+Aek0DmNLwI3PLUhWu1iLAg27LvCJSlUorjYbtbQiIJJbDEZKodtHqtRJJeE1wjkKeqBiAWWyhKXiRwlJnxlFqc5XbA8cdL1qcmM3JcGNk0oftvjtxwBC88uhA/Of9G3DL2TqxevE6yXZInSpTYTrBlDe0EZgkB9O/6q2vw4B2P4+qB0zBz8n3Y/c+98ayNALLq9BhxYDSYslwGx2aJHXB+HbwUAFcmeHokrs6EHKG40P69hX/DZ8+/iyFHShHaugf33vgQjh05bit54nZPFo+T2oQMyrIrURXzn9/ftwAbP1iKC45XoWrVFu3c0ahwvTaOkRS2hMpTBdxSY2ZABY7Th6kxcAFZtRGryy7+vn7lZvwQfJ8IipGuKELhMLas2RZ3OlRAlLymncNitXv2UzXrlm3EEELBi9xHIoqDew/j6KGjFntnpzKN8CBF9HfxjQocfxpF8qd4WIwT36nHmrVXJaVr904I60fyorG5+i49u0ixnOSSi7MBIJZBIUpzYpUZe+3au7M2McnfMUFDTk42itoVCZ+1eqxm9oYfj6bkEapRHZuEwB0R9WjSyEzGEqlIVXUijN9vmHkt0LnYXO9906RLcObAPpZRL4YIkr0zc5Ywk9aJvE312J13TUORjm+Fx4XZT8+ELztLAIzYXrNp/1wpKSpYAmVDNrvJpZeTj1u27cinliLU2F8L2xXgtufi+3V391dZ4ieihgqK52h0spjLVKXO4tWyn5oV680Jiqvm3YaxPxltUa0WbSHYbLhSknS2YGIH3HtI8nOvibetMK1i5unj2X3F5eY/nYcPQNuhZ2qfPPh/X+HbP3/YgMRYHRDT5ijrxqX0mDSLTnF4xdfY9sL72rusjm1w1tSxUiZH/BE9ZDEX6spqm2zQOBbvNwa4QLKlzu1rb45KcdcEM7svzKHFHRgXhs25zRzrX859Hjvf/zxhPCZNx8BuslT0RK27632/bhsW/eIxQN+cdsivb4avMN8SvMsq0ppac/nap0La6hoDHKf/RDIf0urJYzfULmHwCkECRCnoNHwQzp9zU+ww69ClM57G2kdeQqg2YGlDnY5RB4qcKhMGTDSCbxb+FR9PuRfhUr/2116TR+Os6ePknRlUmyjtkRo7JweNuJO6zJBj8AdbLdZA6RnfC//mpDmWwTIES1dbbApJ4JabWxeyy/vq8YXY/Ow7JrZ5fTvh/H+bht4TL2GqySuAn7hNS4EQcxkPLF6DDc+8gbK1/zRb6D5hJEY/O5tpiSxLuCGdR6174VtRtR/BzEJRMoF7BbF9K5sEHN9olG/rmzQ3KVyxkYV0h6Vg2drJSrmBfmTH259o6jJcHTT/kt21GL2Z89DtkgtQct5Z8DDXvaGCoWgojLJtu7B/8Vrs/GAx/NsPSpZq8D3TcO5d18PldkEqKiLyPLyYBTK6z5XbFd7CpO7uz5X22Yx3NhU4Ti8i9njkJEUjYSZ1K4FIjaWEwJKBsJnN9rNgeM38l7Hvr8vj2zkZXcxc96LBvVDUqxvyOhTDne0DYcfCdQEESitRufsQyjfvQMQfhJqtbDeiP4b/5mcM/LMtFV52hUmqR0w8+chqNyLZoQB/YNLPEzp8jdhMmxcV5icPOz8i+gy4FMsRm05JoPaOb9yOb1//CDvfW4RobVhJGcu/ywpOOOYm6DZuOPpdPw5dLh4KKeizAUodYGbg7fLCWzyMDZykPgCFp7Z+gAY2007q9vWNBi9UiVDZWp7Ys92pXJ7sVPw2Ye1GmDkph5Z/jcOrNuLY19tRvnUXItVBC3iaKmPSVzigJ0oGn4lOFwzAGaOHIqttgf0u6aK0K4VI0qBwZcFTfAFrO+lF4A+cqM8b+8CIDYg9ECmJGtyPUPl6RJnaVAtbDduhFqcmcjTiDkeUqcUKBMrYwPDXxRyG/Bzm1rdBdrsi3ZERZgWIdZooobMk5kT5NXmZeiw6X/OYk0z8ueHnIQkPjOA0Ss9OJ7WMl6vLSNVm5rAclWtBcAIpgH2Fsp3KbahNi5SfUPp16c3uBHfBACZxSU9v8Zwk37PrhJPajQWCN/Rs0lNhzD542Kj1MG/MZdQnUqsdkVw/YpfrFOopaXytgFFKZ6niUvKdFoOIeD2MpKe5aiw6V2OSmpzkM2hkJUJTHm7LVSZ/knxqnmjFIuywfydzOPdALSBoSIUlbE5Uu7JgxoP1BHGfxTEhbrhze8Kd34v9nrKVaZsYX4BGTmY39anE/XXw8lJ19Zr6rN3DvMV90hQJTfAYFVWN2oUYstRRKRSxlP6ZbVBNwty5PTSGy4sUUo0O2rZGa6tmLNqbitgDAFO7aIxGEa0/hmjdAUSCx/mF2sZSdqowoXMhpMZEeyapZeJieLWDK6crXHxxR3pW51zL+O0mmZlmrracr4cJ6SEa0epWKAMyEirXStjtnlhFG9h3S5Wo+NNAiBaDub1FIL6SWJI4vYs5+FOr7m+yf9BM4Pgtv8H4OmSAaDSoFdbyYJ6Ga/gqDO0YDXPzEIllpMWsPrdLnN1ZTIB8DJcc9jZPA8zlKUzV5Gdj6G29D2m6gOPE0+D8uVoO2A64RRIvzOK78jZr4QE5yYXp/BFlnyD2JPlWajzxaZLLGVc1t4GTtbz8xFfqnmYrNY54X407GdCSARwnvgvoZUhRTeYpRkv1vjrp4stk+brVuuS924pNQuJ9c4XeV3AKcJwCeoz3BBy2a5kD6Am9b5JWLUtStGsODyj/iCTO47VQ4vNqtzN+K9kNkxRud8TTY39BqnKbzieee5yGJqSxMqUqVeIXzPNvvGIsehoBFtXveViqQEu1xInE5/N4DUW/Uxw0PgnK60SWp/pE6drfiM8x8cfyzoWwVOgUs2Vz9Xtcno4Tkgxs6deZ8UOI1Qt6WjhgPCnK60/5Y4cPp/PEJIN7MfK6Tf40I/4gUW8LA4xPFPIk+yNIUPd4KgNnEH+Y6J2I1W8WOxywMt1WL2C8P5MXQhy0+ykvjZisq9DRSNEjP5tBfK6Iz4K8qr+GnHBR/y/AALfLrsJ3yU69AAAAAElFTkSuQmCC"
  },
  gotoHarvestBean(){
    wx.navigateTo({
      url: '/pages/beansHarvestDetails/beansHarvestDetails',
    })
  },
  download() {
    wx.navigateTo({
      url: '/pages/navigateDownload/navigateDownload',
    })
  },
  showAppdDwnload() {
    this.setData({
      appdownloadHidden: false
    })
  },
  inviteFriend() {
    console.log('inviteFriend')
    wx.navigateTo({
      url: '/pages/inviteFriends/inviteFriends',
    })
  },
  gotoSeaFriends() {
    wx.navigateTo({
      url: '/pages/seaFriends/seaFriends',
    })
  },
  onReady(e) {
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  gotoLogin() {
    console.log('getRoute:', Common.getRoute())
    wx.redirectTo({
      url: `/pages/user/login/login?jumpUrl=${Common.getRoute()}`
    })
  },

  gotoRedPackage() {
    wx.navigateTo({
      url: '/pages/signInRedPackage/signInRedPackage'
    })
  },
  helpCenter() {
    wx.navigateTo({
      url: '/pages/helpCenter/helpCenter',
    })
  },
  // 查看大家的手气
  envelopelist() {
    var that = this;
    let { envEnvelopeId, envCode } = this.data
    console.log('envEnvelopeId', envEnvelopeId)
    if (!envCode) {
      wx.navigateTo({
        url: `/pages/beanBagDetail/beanBagDetail?envEnvelopeId=${envEnvelopeId}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/beanBagDetail/beanBagDetail?envEnvelopeId=${envEnvelopeId}&envCode=${envCode}`,
      })
    }

    this.setData({
      reflashUrl: false
    })

    setTimeout(() => {
      that.setData({
        reflashUrl: true
      })
    }, 1000);
  },
  // 我要转豆
  zhuanBean(){
    wx.navigateTo({
      url: '/pages/turnBeans/turnBeans',
    })
  },
  // 开豆包
  openPopup() {
    let that = this
    var cellPhone = app.globalData.userInfo.cellPhone
    var params = {
      customerCode: Common.getCustomerCode()
    };
    wx.createAudioContext('myAudio').play()
    let url = Api.userEnvelope.receiveTimingConvertEnvelope
    let MD5signStr = Common.md5sign(params);
    let reqParams = Object.assign(params, { sign: MD5signStr })

    Common.request.post(url, reqParams, function (data) {
      console.log('data:', data)
      let bRotateC = 'beanRotates'
      let beanBag = data.message.beanBag
      let remark = data.message.remark;
      let envelopeId =  data.message.envEnvelopeId
      let stateShow = 2

      that.setData({
        bRotateC, beanBag, remark, envelopeId, stateShow
      })
    }, error => {
      console.log('error')
    })
  },
  closeDownload() {
    this.setData({
      appdownloadHidden: true
    })
  },
  closePopup() {
    this.setData({
      popupHidden: true
    })
  },
  async snedRequest(url, params) {
    let header = {
      'Cookie': app.globalData.token,//用户信息
      'Content-Type': 'application/json;charset=UTF-8'
    }

    await new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'post',
        data: params || {},
        header,
        success: (res) => {
          if (res.data.status && res.data.status == "OK") {
            resolve(res.data)
          } else {
            let code = res.data.code
            switch (code) {
              case 100:
                console.log('抢完')
                break;
              case 101:
                console.log('抢过')
                break;
              default:
                wx.showModal({
                  content: res.data.message.remark,
                  showCancel: false
                })
            }
          }
        },
        fail: (err) => {
          console.log('qiangdou error')
          reject(err)
        },
        complete: (e) => {
          wx.hideLoading()
        }
      })
    })
  },
  async renderByQueryShowBeanBag() {
    console.log('抢豆包')

    var that = this;
    let customerCode = Common.getCustomerCode()

    let url = `${Api.userEnvelope.checkCollarBag}?customerCode=${customerCode}`
    let params = {
      customerCode
    }
    try {
      let res = await Common.ajax.post(url, params)
      console.log('res111', res)
      if (res.message.remark == '可以抢购') {
        this.setData({
          stateShow: 0, //控制 弹窗 里面的类型
          setShow: true, //应该是 控制弹窗 显示/隐藏
          popupHidden: false
        })
      }
    } catch (err) {
      console.log('err', err)

      switch (err.code) {
        case 0:
          wx.showModal({
            content: err.message,
            showCancel: false
          })
          break;
        //抢完
        case 100:
          this.setData({
            stateShow: 0, //控制 弹窗 里面的类型
            envEnvelopeId: err.message.envEnvelopeId,
            popupHidden: false
          })
          break;
        case 101:
          // 抢过
          wx.showToast({
            title: err.message.remark,
            success() {
              setTimeout(function () {
                let envEnvelopeId = err.message.envEnvelopeId;
                wx.navigateTo({
                  url: `/pages/beanBagDetail/beanBagDetail?envEnvelopeId=${envEnvelopeId}`,
                })
              }, 1000)
            }
          })
          break;
        default:
          wx.showToast({
            title: err.message.remark,
          })
          break;
      }
    }
  },

  // 抢豆包
  async robBean() {
    this.renderByQueryShowBeanBag();
    return;

    let that = this

    let res = await this.snedRequest(url)
    return;
    let params = {
      beanNum: "1",
      cellPhone: "15618334836",
      customerId: "608776",
      payMethod: "2",
      sign: "59610488F2167F8AC693EB509C049C69",
      wxOpenId: "o2lw5w44KP6kJ8cgv2V1_kmLRcNw"
    }
  },
  cashBean() {
    wx.navigateTo({
      url: '/pages/chargeBean/chargeBean',
    })

  },
  snedBean() {
    wx.navigateTo({
      url: '/pages/sendBean/sendBean'
    })
  },
  setUserCenter(user) {//获取用户信息
    let tels = user.cellPhone.substring(0, 3) + '****' + user.cellPhone.substring(7)
    this.setData({
      inforlist: user,
      username: tels
    })
    
  },
  goDetails(e) {//账户明细
    let types = e.currentTarget.dataset.types
    wx.navigateTo({
      url: '/pages/user/account-details/account-details?type=' + types,
    })
  },
  goSets() {//设置
    wx.navigateTo({
      url: '/pages/user/personalset/personalset',
    })
  },
  goOrders(e) {//订单列表
    let curtab = e.currentTarget.dataset.tabs
    let states = e.currentTarget.dataset.states
    wx.navigateTo({
      url: '/pages/order/all-orders/all-orders?curtab=' + curtab + "&states=" + states,
    })
  },
  goReturns() {//退换货
    wx.navigateTo({
      url: '/pages/order/returns/returns',
    })
  },
  onShow: async function () {
    // console.log('onshow---', Common.getRoute())
    if (!Common.biz.loggedIn(Common.getRoute())) {
      return;//检查登录
    } else {
      let customerCode = Common.getStorage('customerCode')
      let user = await Common.getUser(customerCode)
      this.setUserCenter(user)
      var isT =false
      if (user.noGetBeanNum>0){
        isT=true
      }
      this.setData({
        isVip:user.isVip,
        popBenas:isT,
        noGetBeanNum: user.noGetBeanNum
      })
      
      console.log('*************', user)
      // app.getUser() ? this.setUserCenter(user) : this.gotoLogin()
    }

  }
})