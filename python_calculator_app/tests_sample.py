# tests_sample.py
from safe_eval import evaluate

def test_numbers():
    assert evaluate("2") == 2
    assert evaluate("3.5") == 3.5

def test_arithmetic():
    assert evaluate("2+3*4") == 14
    assert evaluate("(1+2)**3") == 27
    assert evaluate("10//3") == 3
    assert evaluate("10%3") == 1

def test_unary():
    assert evaluate("-5 + +2") == -3

def test_divzero():
    try:
        evaluate("1/0")
        assert False, "Expected ZeroDivisionError"
    except ZeroDivisionError:
        pass

def test_disallowed():
    for bad in ["__import__('os')", "a+b", "abs(2)", "[1,2,3]", "'hi'"]:
        try:
            evaluate(bad)
            assert False, f"Should reject: {bad}"
        except Exception:
            pass
